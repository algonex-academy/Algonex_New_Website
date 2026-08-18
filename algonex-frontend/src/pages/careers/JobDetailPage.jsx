import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Button, Empty, Spin, Modal, Form, Input, Upload, App } from "antd";
import { ArrowLeftOutlined, UploadOutlined, EnvironmentOutlined, DollarOutlined, ExportOutlined } from "@ant-design/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { careersAPI } from "../../api/careers";
import { useAuth } from "../../hooks/useAuth";

export default function JobDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { message } = App.useApp();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    careersAPI.detail(slug)
      .then((res) => setJob(res.data?.data || res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleApply = async () => {
    try {
      const values = await form.validateFields();
      setApplyLoading(true);
      const formData = new FormData();
      if (values.resume?.[0]) formData.append("resume", values.resume[0].originFileObj);
      if (values.cover_letter) formData.append("cover_letter", values.cover_letter);
      await careersAPI.apply(slug, formData);
      setApplied(true);
      setShowApply(false);
      message.success("Application submitted!");
    } catch (err) {
      if (err.response) {
        const apiErr = err.response?.data?.error;
        const fieldError = apiErr?.details
          ? Object.values(apiErr.details).flat()[0]
          : null;
        message.error(fieldError || apiErr?.message || "Application failed.");
      }
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 100 }}><Spin size="large" /></div>;
  if (!job) return <div style={{ padding: 80, textAlign: "center" }}><Empty description="Job not found" /><Button type="primary" onClick={() => navigate("/careers")} style={{ marginTop: 16 }}>Browse Jobs</Button></div>;

  const isExternal = job.apply_mode === "external";

  return (
    <div style={{ background: "#f8fafc" }}>
      <div style={{ background: "linear-gradient(135deg, #00B4D8, #0891b2)", padding: "48px 24px", color: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ color: "white", marginBottom: 16, padding: 0 }}>Back</Button>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Tag color="cyan">{job.department}</Tag>
            <Tag color="blue">{(job.job_type || "").replace("_", " ")}</Tag>
            {job.is_remote && <Tag color="green">Remote</Tag>}
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "white", marginBottom: 8 }}>{job.title}</h1>
          <div style={{ display: "flex", gap: 20, color: "rgba(255,255,255,0.8)", fontSize: 15 }}>
            <span><EnvironmentOutlined /> {job.location}</span>
            {job.salary_min && <span><DollarOutlined /> ₹{job.salary_min}–{job.salary_max} LPA</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <Card style={{ borderRadius: 12, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Description</h2>
          <div className="md-content"><Markdown remarkPlugins={[remarkGfm]}>{job.description}</Markdown></div>
        </Card>

        {job.requirements && (
          <Card style={{ borderRadius: 12, marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Requirements</h2>
            <div className="md-content"><Markdown remarkPlugins={[remarkGfm]}>{job.requirements}</Markdown></div>
          </Card>
        )}

        {isExternal ? (
          <>
            {(job.company_name || job.company_logo) && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                {job.company_logo && <img src={job.company_logo} alt={job.company_name || "Company logo"} style={{ height: 40, maxWidth: 120, objectFit: "contain" }} />}
                {job.company_name && <span style={{ fontSize: 16, fontWeight: 600 }}>{job.company_name}</span>}
              </div>
            )}
            {job.external_link ? (
              <Button type="primary" size="large" block icon={<ExportOutlined />} href={job.external_link} target="_blank" rel="noopener noreferrer" style={{ height: 48, borderRadius: 8 }}>
                Apply on company site
              </Button>
            ) : (
              <>
                <Button type="primary" size="large" block disabled style={{ height: 48, borderRadius: 8 }}>
                  Apply on company site
                </Button>
                <p style={{ textAlign: "center", color: "#64748b", marginTop: 8, fontSize: 14 }}>Application link unavailable — please check back later.</p>
              </>
            )}
          </>
        ) : applied ? (
          <Button size="large" block style={{ height: 48, borderRadius: 8, background: "#22c55e", color: "white", border: "none" }}>Application Submitted</Button>
        ) : (
          <Button type="primary" size="large" block onClick={() => {
            if (!isAuthenticated) { navigate("/signin"); return; }
            setShowApply(true);
          }} style={{ height: 48, borderRadius: 8 }}>
            Apply Now
          </Button>
        )}
      </div>

      {!isExternal && (
        <Modal title={`Apply for ${job.title}`} open={showApply} onOk={handleApply} onCancel={() => setShowApply(false)} okText="Submit Application" confirmLoading={applyLoading}>
          <Form form={form} layout="vertical">
            <Form.Item name="resume" label="Resume (PDF)" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} rules={[{ required: true, message: "Please upload your resume" }]}>
              <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
                <Button icon={<UploadOutlined />}>Select PDF</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="cover_letter" label="Cover Letter (optional)">
              <Input.TextArea rows={4} placeholder="Why are you a good fit for this role?" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
