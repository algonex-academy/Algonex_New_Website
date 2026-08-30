import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Button, Empty, Spin, Modal, Form, Input, App, Row, Col, Select, InputNumber, Checkbox } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
} from "@ant-design/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { eventsAPI } from "../../api/events";
import apiClient from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

const TYPE_COLORS = { workshop: "cyan", webinar: "blue", hackathon: "magenta", meetup: "green" };

export default function EventDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regStatus, setRegStatus] = useState(null); // "confirmed" | "waitlisted" | null
  const [actionLoading, setActionLoading] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [guestForm] = Form.useForm();

  const [crueIdVerifying, setCrueIdVerifying] = useState(false);
  const [crueIdError, setCrueIdError] = useState(null);
  const [crueIdSuccess, setCrueIdSuccess] = useState(false);

  const handleApplyCrueId = async (form) => {
    const val = form.getFieldValue("student_id");
    if (!val || !val.trim()) {
      setCrueIdError("Please enter your CRUE ID");
      setCrueIdSuccess(false);
      return;
    }
    setCrueIdVerifying(true);
    setCrueIdError(null);
    setCrueIdSuccess(false);

    try {
      const res = await apiClient.get("/signin/verify-crue-id/", {
        params: { crue_id: val.trim() }
      });
      const data = res.data?.data || {};
      setCrueIdSuccess(true);
      message.success("CRUE ID verified! Your details have been auto-filled.");

      form.setFieldsValue({
        full_name: data.full_name || form.getFieldValue("full_name"),
        email: data.email || form.getFieldValue("email"),
        phone: data.phone || form.getFieldValue("phone"),
        college_name: data.college_name || form.getFieldValue("college_name"),
        branch: data.branch || form.getFieldValue("branch"),
        year_of_study: data.year_of_study || form.getFieldValue("year_of_study"),
      });
    } catch (_err) {
      setCrueIdError("Incorrect CRUE ID");
      setCrueIdSuccess(false);
    } finally {
      setCrueIdVerifying(false);
    }
  };

  const fetchEvent = useCallback(() => {
    setLoading(true);
    eventsAPI.detail(slug)
      .then((res) => {
        const data = res.data?.data || res.data;
        setEvent(data);
        if (data.user_registration_status) setRegStatus(data.user_registration_status);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      setGuestModalVisible(true);
      return;
    }
    setActionLoading(true);
    try {
      const res = await eventsAPI.register(slug);
      const status = res.data?.data?.status || res.data?.status || "confirmed";
      setRegStatus(status);
      message.success(status === "waitlisted" ? "Added to waitlist!" : "Successfully registered!");
      fetchEvent();
    } catch (err) {
      message.error(err.response?.data?.error?.message || "Registration failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGuestSubmit = async (values) => {
    setActionLoading(true);
    try {
      const res = await eventsAPI.register(slug, values);
      const status = res.data?.data?.status || res.data?.status || "confirmed";
      setRegStatus(status);
      setGuestModalVisible(false);
      guestForm.resetFields();
      message.success(status === "waitlisted" ? "Added to waitlist!" : "Registration successful! Confirmation details recorded.");
      fetchEvent();
    } catch (err) {
      message.error(err.response?.data?.error?.message || "Registration failed. Please check your details.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await eventsAPI.cancel(slug);
      setRegStatus(null);
      message.success("Registration cancelled.");
      fetchEvent();
    } catch (err) {
      message.error(err.response?.data?.error?.message || "Cancellation failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 100 }}><Spin size="large" /></div>;

  if (!event) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        <Empty description="Event not found" />
        <Button type="primary" onClick={() => navigate("/events")} style={{ marginTop: 16 }}>Browse Events</Button>
      </div>
    );
  }

  const spotsLeft = event.spots_left ?? (event.capacity - (event.registrations?.filter(r => r.status === "confirmed").length || 0));
  const eventType = event.event_type || event.type || "";
  const startDate = event.start_date ? new Date(event.start_date) : null;
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isPast = event.status === "past";

  return (
    <div style={{ background: "#f8fafc" }}>
      {/* Banner */}
      <div
        style={{
          background: event.image
            ? `linear-gradient(135deg, rgba(0,180,216,0.85), rgba(8,145,178,0.9)), url(${event.image}) center/cover`
            : "linear-gradient(135deg, #00B4D8, #0891b2)",
          padding: "48px 24px",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ color: "white", marginBottom: 16, padding: 0 }}>
            Back to Events
          </Button>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Tag color={TYPE_COLORS[eventType] || "default"}>{eventType || "Event"}</Tag>
            {isPast && <Tag color="default">Past Event</Tag>}
            {!isPast && spotsLeft !== undefined && (
              <Tag color={spotsLeft <= 0 ? "red" : spotsLeft <= 5 ? "orange" : "green"}>
                {spotsLeft <= 0 ? "Full — Waitlist" : `${spotsLeft} spots left`}
              </Tag>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "white", marginBottom: 12 }}>{event.title}</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
            {startDate && (
              <span><CalendarOutlined /> {startDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            )}
            {startDate && endDate && (
              <span><ClockCircleOutlined /> {startDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} – {endDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
            )}
            <span><EnvironmentOutlined /> {event.location}</span>
            {event.capacity && <span><TeamOutlined /> {event.capacity} capacity</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        {/* Registration Status + Action */}
        <Card style={{ borderRadius: 12, marginBottom: 24 }}>
          {regStatus === "confirmed" ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <Tag color="green" icon={<CheckCircleOutlined />} style={{ fontSize: 14, padding: "4px 12px" }}>Registered — Confirmed</Tag>
                {event.meeting_link && (
                  <div style={{ marginTop: 8 }}>
                    <LinkOutlined /> Meeting link: <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">{event.meeting_link}</a>
                  </div>
                )}
              </div>
              {!isPast && (
                <Button danger onClick={handleCancel} loading={actionLoading}>Cancel Registration</Button>
              )}
            </div>
          ) : regStatus === "waitlisted" ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <Tag color="orange" style={{ fontSize: 14, padding: "4px 12px" }}>On Waitlist</Tag>
              <Button danger onClick={handleCancel} loading={actionLoading}>Leave Waitlist</Button>
            </div>
          ) : isPast ? (
            <Button disabled block size="large">Event has ended</Button>
          ) : (
            <Button type="primary" block size="large" onClick={handleRegister} loading={actionLoading} style={{ height: 48, borderRadius: 8 }}>
              {spotsLeft <= 0 ? "Join Waitlist" : "Register Now"}
            </Button>
          )}
        </Card>

        {/* Description */}
        <Card style={{ borderRadius: 12, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>About This Event</h2>
          <div className="md-content"><Markdown remarkPlugins={[remarkGfm]}>{event.description}</Markdown></div>
        </Card>

        {/* Details grid */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[
            { label: "Type", value: eventType, icon: <CalendarOutlined /> },
            { label: "Location", value: event.location, icon: <EnvironmentOutlined /> },
            { label: "Capacity", value: event.capacity, icon: <TeamOutlined /> },
            { label: "Spots Left", value: spotsLeft, icon: <TeamOutlined /> },
          ].filter(d => d.value !== undefined).map((d, i) => (
            <Col key={i} xs={12} sm={6}>
              <Card size="small" style={{ borderRadius: 10, textAlign: "center" }}>
                <div style={{ color: "#00B4D8", fontSize: 18, marginBottom: 4 }}>{d.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{d.value}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{d.label}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Guest Event Registration Modal — No Sign-In Required */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
            Register for {event.title}
          </div>
        }
        open={guestModalVisible}
        onCancel={() => {
          setGuestModalVisible(false);
          guestForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        centered
        width={480}
      >
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
          No sign-in required! Enter your details below to reserve your spot.
        </p>

        <Form
          form={guestForm}
          layout="vertical"
          onFinish={handleGuestSubmit}
          requiredMark="optional"
        >
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input prefix={<UserOutlined style={{ color: "#94a3b8" }} />} placeholder="e.g. Rahul Sharma" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" }
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: "#94a3b8" }} />} placeholder="e.g. rahul@example.com" size="large" />
          </Form.Item>

          {/* Phone Field */}
          {(event?.form_phone_mode || "required") !== "hidden" && (
            <Form.Item
              name="phone"
              label={`Phone / WhatsApp Number ${event?.form_phone_mode === "optional" ? "(Optional)" : ""}`}
              rules={event?.form_phone_mode === "optional" ? [] : [{ required: true, message: "Please enter your phone number" }]}
            >
              <Input prefix={<PhoneOutlined style={{ color: "#94a3b8" }} />} placeholder="e.g. +91 9876543210" size="large" />
            </Form.Item>
          )}

          {/* College Name Field */}
          {(event?.form_college_mode || "optional") !== "hidden" && (
            <Form.Item
              name="college_name"
              label={`College / Organization ${event?.form_college_mode === "required" ? "" : "(Optional)"}`}
              rules={event?.form_college_mode === "required" ? [{ required: true, message: "Please enter your college name" }] : []}
            >
              <Input prefix={<BankOutlined style={{ color: "#94a3b8" }} />} placeholder="e.g. ABC Institute of Technology" size="large" />
            </Form.Item>
          )}

          {/* Branch Field */}
          {event?.form_branch_mode && event.form_branch_mode !== "hidden" && (
            <Form.Item
              name="branch"
              label={`Branch / Department ${event.form_branch_mode === "required" ? "" : "(Optional)"}`}
              rules={event.form_branch_mode === "required" ? [{ required: true, message: "Please enter your branch" }] : []}
            >
              <Input placeholder="e.g. Computer Science & Engineering" size="large" />
            </Form.Item>
          )}

          {/* Year of Study Field */}
          {event?.form_year_mode && event.form_year_mode !== "hidden" && (
            <Form.Item
              name="year_of_study"
              label={`Year of Study ${event.form_year_mode === "required" ? "" : "(Optional)"}`}
              rules={event.form_year_mode === "required" ? [{ required: true, message: "Please select your year of study" }] : []}
            >
              <Select placeholder="Select Year of Study" size="large">
                <Select.Option value="1st Year">1st Year</Select.Option>
                <Select.Option value="2nd Year">2nd Year</Select.Option>
                <Select.Option value="3rd Year">3rd Year</Select.Option>
                <Select.Option value="4th Year">4th Year</Select.Option>
                <Select.Option value="Postgraduate / Alumni">Postgraduate / Alumni</Select.Option>
              </Select>
            </Form.Item>
          )}

          {/* Roll No / USN Field */}
          {event?.form_roll_no_mode && event.form_roll_no_mode !== "hidden" && (
            <Form.Item
              name="roll_no"
              label={`Student Roll No / USN ${event.form_roll_no_mode === "required" ? "" : "(Optional)"}`}
              rules={event.form_roll_no_mode === "required" ? [{ required: true, message: "Please enter your Roll No / USN" }] : []}
            >
              <Input placeholder="e.g. 1AB21CS001" size="large" />
            </Form.Item>
          )}

          {/* CRUE ID Field */}
          {event?.form_student_id_mode && event.form_student_id_mode !== "hidden" && (
            <Form.Item
              name="student_id"
              label={`CRUE ID / Algonex Code ${event.form_student_id_mode === "required" ? "" : "(Optional)"}`}
              rules={event.form_student_id_mode === "required" ? [{ required: true, message: "Please enter your CRUE ID" }] : []}
              validateStatus={crueIdError ? "error" : (crueIdSuccess ? "success" : "")}
              help={
                crueIdError ? (
                  <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>{crueIdError}</span>
                ) : crueIdSuccess ? (
                  <span style={{ color: "#52c41a", fontWeight: "bold" }}>✓ CRUE ID Verified & Details Auto-filled</span>
                ) : null
              }
            >
              <Input.Search
                placeholder="e.g. ACC260001 or P26I0014"
                size="large"
                enterButton={
                  <Button type="primary" loading={crueIdVerifying} style={{ background: "#a855f7", borderColor: "#a855f7" }}>
                    Apply
                  </Button>
                }
                onSearch={() => handleApplyCrueId(guestForm)}
                onChange={() => {
                  if (crueIdError) setCrueIdError(null);
                  if (crueIdSuccess) setCrueIdSuccess(false);
                }}
              />
            </Form.Item>
          )}

          {/* GitHub / Portfolio Field */}
          {event?.form_github_mode && event.form_github_mode !== "hidden" && (
            <Form.Item
              name="github_url"
              label={`GitHub / Portfolio URL ${event.form_github_mode === "required" ? "" : "(Optional)"}`}
              rules={event.form_github_mode === "required" ? [{ required: true, message: "Please enter your GitHub/Portfolio URL" }] : []}
            >
              <Input placeholder="e.g. https://github.com/username" size="large" />
            </Form.Item>
          )}

          {/* Customizable Google Forms Fields */}
          {(event?.registration_form_schema || []).map((field, idx) => {
            const fieldKey = field.id || field.name || `custom_${idx}`;
            const fieldLabel = field.label || field.title || fieldKey;
            const isRequired = field.required !== false && field.mandatory !== false;
            const fieldType = field.type || "text";

            return (
              <Form.Item
                key={fieldKey}
                name={fieldKey}
                label={fieldLabel}
                rules={[{ required: isRequired, message: `Please provide ${fieldLabel}` }]}
              >
                {fieldType === "select" ? (
                  <Select placeholder={`Select ${fieldLabel}`} size="large">
                    {(field.options || []).map((opt, i) => (
                      <Select.Option key={i} value={typeof opt === "string" ? opt : opt.value || opt.label}>
                        {typeof opt === "string" ? opt : opt.label || opt.value}
                      </Select.Option>
                    ))}
                  </Select>
                ) : fieldType === "textarea" ? (
                  <Input.TextArea placeholder={field.placeholder || `Enter ${fieldLabel}`} rows={3} size="large" />
                ) : fieldType === "number" ? (
                  <InputNumber placeholder={field.placeholder || `Enter ${fieldLabel}`} size="large" style={{ width: "100%" }} />
                ) : fieldType === "checkbox" ? (
                  <Checkbox>{field.placeholder || fieldLabel}</Checkbox>
                ) : (
                  <Input placeholder={field.placeholder || `Enter ${fieldLabel}`} size="large" />
                )}
              </Form.Item>
            );
          })}

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={actionLoading}
              style={{
                height: 46,
                borderRadius: 8,
                fontWeight: 600,
                backgroundColor: "#00B4D8",
                borderColor: "#00B4D8"
              }}
            >
              Confirm Registration
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
