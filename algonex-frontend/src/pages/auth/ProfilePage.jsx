import { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Card, Avatar, App, Row, Col, Typography, Modal, Table, Tag } from "antd";
import { UserOutlined, DollarOutlined, DownloadOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { authAPI } from "../../api/auth";
import { paymentsAPI } from "../../api/payments";
import { certificatesAPI } from "../../api/certificates";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [fetchingSummary, setFetchingSummary] = useState(true);
  
  // Certificates State
  const [certificates, setCertificates] = useState([]);
  const [fetchingCertificates, setFetchingCertificates] = useState(true);
  
  // Payment Modal State
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentForm] = Form.useForm();
  
  // Dynamic QR Code generation state and ref
  const qrRef = useRef(null);
  const [amountToPay, setAmountToPay] = useState("");

  useEffect(() => {
    fetchPaymentSummary();
    fetchCertificates();
  }, []);

  const fetchPaymentSummary = async () => {
    try {
      const res = await paymentsAPI.getSummary();
      setPaymentSummary(res.data);
    } catch (_err) {
      console.log("No student registration found or error fetching payment summary.");
    } finally {
      setFetchingSummary(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await certificatesAPI.myCertificates();
      const certs = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setCertificates(certs);
    } catch (err) {
      console.log("Error fetching certificates:", err);
    } finally {
      setFetchingCertificates(false);
    }
  };

  // QR generation logic
  useEffect(() => {
    if (!isPaymentModalVisible || !amountToPay || isNaN(amountToPay) || parseFloat(amountToPay) <= 0 || !user) {
      return;
    }

    const generateQR = () => {
      if (qrRef.current && window.QRCode) {
        qrRef.current.innerHTML = '';
        try {
          const upiId = 'pasalaganesh38-1@okhdfcbank';
          const payeeName = 'Ganesh Pasala';
          const name = ((user.first_name || '') + '_' + (user.last_name || '')).trim().replace(/\s+/g, '_') || 'Student';
          const id = paymentSummary?.student_id || 'ALGXXXXXXXXXXXX';
          const transactionNote = `${name}_${id}_Pay`;
          const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountToPay}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

          new window.QRCode(qrRef.current, {
            text: upiUri,
            width: 180,
            height: 180,
            colorDark: '#1a0533',
            colorLight: '#ffffff',
            correctLevel: window.QRCode.CorrectLevel.M,
          });
        } catch (err) {
          console.error('Failed to generate QR code:', err);
          qrRef.current.innerHTML =
            "<p style='color:#ef4444; font-size:12px; padding:20px;'>QR Code Error</p>";
        }
      }
    };

    const timer = setTimeout(() => {
      if (window.QRCode) {
        generateQR();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.async = true;
        script.onload = generateQR;
        document.head.appendChild(script);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isPaymentModalVisible, amountToPay, user, paymentSummary]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authAPI.updateUser(values);
      await refreshUser();
      message.success("Profile updated!");
    } catch {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (values) => {
    setPaymentLoading(true);
    try {
      const payload = {
        amount: values.amount,
        upiTransactionId: values.upiTransactionId,
        remarks: values.remarks,
      };
      await paymentsAPI.submitPayment(payload);
      message.success("Payment details submitted successfully and pending approval.");
      setIsPaymentModalVisible(false);
      paymentForm.resetFields();
      fetchPaymentSummary();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to submit payment details.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!user) return null;

  const paymentColumns = [
    { title: "Amount", dataIndex: "amount", key: "amount", render: (val) => `₹${val}` },
    { title: "Transaction ID", dataIndex: "upi_transaction_id", key: "upi_transaction_id" },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => (
      <Tag color={status === "approved" ? "green" : status === "rejected" ? "red" : "orange"}>
        {status.toUpperCase()}
      </Tag>
    )},
    { title: "Date", dataIndex: "payment_date", key: "payment_date", render: (date) => new Date(date).toLocaleDateString() },
    {
      title: "Receipt",
      key: "receipt",
      render: (_, record) => {
        if (record.status === "approved" && record.invoice_url) {
          return (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              href={record.invoice_url}
              target="_blank"
              download
            >
              Download
            </Button>
          );
        }
        return null;
      }
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar size={80} icon={<UserOutlined />} src={user.avatar} />
          <h2 style={{ marginTop: 12, marginBottom: 4 }}>
            {user.first_name} {user.last_name}
          </h2>
          <p style={{ color: "#666", marginBottom: 4 }}>{user.email}</p>
          {paymentSummary?.student_id && (
            <Tag color="blue" style={{ fontSize: 14, padding: "4px 12px", borderRadius: 16 }}>
              Student ID: {paymentSummary.student_id}
            </Tag>
          )}
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            bio: user.bio,
          }}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="your.email@gmail.com" />
          </Form.Item>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Form.Item name="first_name" label="First Name" style={{ flex: "1 1 180px", minWidth: 0 }}>
              <Input />
            </Form.Item>
            <Form.Item name="last_name" label="Last Name" style={{ flex: "1 1 180px", minWidth: 0 }}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {!fetchingSummary && paymentSummary && (
        <Card title="Fee Payment & History" bordered={false} style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <div style={{ padding: 16, background: "#f0f2f5", borderRadius: 8, textAlign: "center" }}>
                <Text type="secondary">Total Fee</Text>
                <Title level={4} style={{ margin: 0 }}>₹{paymentSummary.total_fee}</Title>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ padding: 16, background: "#f6ffed", borderRadius: 8, textAlign: "center" }}>
                <Text type="secondary">Paid Fee</Text>
                <Title level={4} style={{ margin: 0, color: "#389e0d" }}>₹{paymentSummary.paid_fee}</Title>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ padding: 16, background: "#fff2e8", borderRadius: 8, textAlign: "center" }}>
                <Text type="secondary">Remaining Balance</Text>
                <Title level={4} style={{ margin: 0, color: "#d4380d" }}>₹{paymentSummary.balance_fee}</Title>
              </div>
            </Col>
          </Row>

          {parseFloat(paymentSummary.balance_fee) > 0 && (
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <Button type="primary" icon={<DollarOutlined />} onClick={() => {
                const bal = paymentSummary.balance_fee;
                setAmountToPay(bal);
                paymentForm.setFieldsValue({ amount: bal });
                setIsPaymentModalVisible(true);
              }}>
                Pay Fee
              </Button>
            </div>
          )}

          <Table 
            dataSource={paymentSummary.payments} 
            columns={paymentColumns} 
            rowKey="id" 
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* Certificates Section */}
      <Card title="My Certificates" bordered={false} loading={fetchingCertificates}>
        <Table 
          dataSource={certificates} 
          columns={[
            { 
              title: "Certificate ID", 
              dataIndex: "certificate_id", 
              key: "certificate_id",
              render: (id) => <Tag color="blue">{id}</Tag>
            },
            { 
              title: "Title", 
              dataIndex: "title", 
              key: "title" 
            },
            { 
              title: "Issue Date", 
              dataIndex: "issue_date", 
              key: "issue_date",
              render: (date) => new Date(date).toLocaleDateString()
            },
            { 
              title: "Action", 
              key: "action",
              render: (_, record) => (
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  size="small"
                  href={`/verify/Certificate/${record.certificate_id}`}
                  target="_blank"
                >
                  View & Download
                </Button>
              )
            }
          ]} 
          rowKey="certificate_id" 
          pagination={false}
          locale={{ emptyText: "No certificates found. Complete a course/internship to receive a certificate." }}
          size="small"
        />
      </Card>

      <Modal
        title="Submit Payment Details"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={paymentForm} onFinish={handlePaymentSubmit}>
          <Form.Item 
            name="amount" 
            label="Amount Paid (₹)" 
            rules={[{ required: true, message: "Please enter the amount paid" }]}
          >
            <Input 
              type="number" 
              min={1} 
              onChange={(e) => setAmountToPay(e.target.value)}
            />
          </Form.Item>

          {/* Dynamic UPI QR Code and payment info */}
          {amountToPay && !isNaN(amountToPay) && parseFloat(amountToPay) > 0 && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              marginBottom: 24, 
              padding: 16, 
              background: "#f9f9f9", 
              borderRadius: 8, 
              border: "1px solid #f0f0f0" 
            }}>
              <div ref={qrRef} style={{ padding: 10, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 4, marginBottom: 12 }}></div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1890ff", marginBottom: 4 }}>
                  Phone Number: 9959789424
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  UPI ID: <strong>pasalaganesh38-1@okhdfcbank</strong>
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  Payee: Ganesh Pasala
                </div>
              </div>
            </div>
          )}

          <Form.Item 
            name="upiTransactionId" 
            label="UPI Transaction ID (UTR)" 
            rules={[{ required: true, message: "Please enter the UPI transaction ID / UTR" }]}
          >
            <Input placeholder="Enter 12-digit UTR number" />
          </Form.Item>
          
          <Form.Item name="remarks" label="Remarks (Optional)">
            <Input.TextArea rows={2} />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={paymentLoading} block>
              Submit Payment for Approval
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
