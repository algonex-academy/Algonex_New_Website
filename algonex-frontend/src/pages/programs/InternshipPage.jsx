import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Tag, Button, Input, Row, Col, Empty, Spin, Collapse, Form, Modal, Select, message } from "antd";
import {
  LaptopOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  BuildOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { programsAPI, getApiErrorMessage } from "../../api/programs";
import { getImageUrl } from "../../utils/image";

const MOCK_INTERNSHIPS = [
  {
    id: 2,
    title: "Full Stack Development Internship",
    slug: "fullstack-dev-internship",
    program_type: "internship",
    description: "3-month hands-on internship building production-grade web applications with React, Node.js, and cloud technologies. Work with full-time mentors.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop",
    duration: "3 months",
    stipend: "₹15,000/month",
    location: "Remote",
    is_remote: true,
    application_deadline: "2026-06-30",
    start_date: "2026-07-15",
    is_featured: true,
    registration_count: 78,
    is_accepting: true,
  },
  {
    id: 4,
    title: "Cloud & DevOps Internship",
    slug: "cloud-devops-internship",
    program_type: "internship",
    description: "Learn AWS, Docker, Kubernetes, and CI/CD pipelines by deploying real applications. Mentored by certified cloud architects.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop",
    duration: "3 months",
    stipend: "₹12,000/month",
    location: "Bangalore",
    is_remote: false,
    application_deadline: "2026-06-25",
    start_date: "2026-07-10",
    is_featured: false,
    registration_count: 56,
    is_accepting: true,
  },
  {
    id: 6,
    title: "UI/UX Design Internship",
    slug: "uiux-design-internship",
    program_type: "internship",
    description: "Design real products using Figma, conduct user research, and build a professional portfolio. Work alongside senior designers on live projects.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&auto=format&fit=crop",
    duration: "3 months",
    stipend: "₹10,000/month",
    location: "Bangalore",
    is_remote: false,
    application_deadline: "2026-07-05",
    start_date: "2026-07-20",
    is_featured: false,
    registration_count: 34,
    is_accepting: true,
  },
];

const FAQS = [
  {
    key: "1",
    label: "Are the internships remote or in-office?",
    children: "We offer both! We have 100% remote roles as well as hybrid/in-office internships at our Bangalore and Hyderabad development centers.",
  },
  {
    key: "2",
    label: "Do interns receive a pre-placement offer (PPO)?",
    children: "Yes, high-performing interns who showcase exceptional coding skills, initiative, and team alignment are actively considered for full-time software engineer roles upon graduation.",
  },
  {
    key: "3",
    label: "What is the typical time commitment required?",
    children: "Our internships are full-time programs requiring 40 hours per week, mimicking full-time developer schedules including daily scrum syncs.",
  },
  {
    key: "4",
    label: "Is there a certificate provided?",
    children: "Definitely. Upon successful internship completion, you will receive an Internship Experience Certificate, a detailed Letter of Recommendation (LOR) from your manager, and a digital badge.",
  },
];

const STEPS = [
  { title: "1. Apply", desc: "Submit your details and select your preferred specialization track." },
  { title: "2. Technical Quiz", desc: "Take a 30-minute online coding & fundamentals assessment." },
  { title: "3. Technical Review", desc: "Showcase your engineering skills in a live panel interview." },
  { title: "4. Receive Offer", desc: "Get matched with your engineering mentor and start onboarding." },
];

export default function InternshipPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [, setSelectedTrack] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    programsAPI.list()
      .then((res) => {
        const results = res.data?.data?.results || res.data?.results || [];
        const filtered = results.filter((p) => p.program_type === "internship");
        if (filtered.length > 0) {
          setInternships(filtered);
        } else {
          setInternships(MOCK_INTERNSHIPS);
        }
      })
      .catch(() => {
        setInternships(MOCK_INTERNSHIPS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApplyClick = (trackName) => {
    setSelectedTrack(trackName);
    form.setFieldsValue({ internshipTrack: trackName });
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (values) => {
    setSubmitting(true);
    try {
      await programsAPI.submitLead({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        subject: `Internship Application: ${values.internshipTrack || "General"}`,
        course_interested: values.internshipTrack || "",
        message: `Internship application.\nTrack: ${values.internshipTrack || "Not specified"}\nResume: ${values.resume}`,
      });
      message.success(`Application for ${values.internshipTrack} submitted successfully! We will review your profile.`);
      setApplyModalOpen(false);
      form.resetFields();
    } catch (err) {
      message.error(getApiErrorMessage(err, "Could not submit your application. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
          padding: "70px 24px 80px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Tag color="blue" style={{ fontSize: 13, padding: "4px 12px", borderRadius: 20, marginBottom: 16, color: "#fff", borderColor: "#fff" }}>
            Real Experience. Guaranteed Stipend.
          </Tag>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 46px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            Empower Your Career with <br />
            <span style={{ color: "#38bdf8" }}>Algonex Technical Internships</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", marginBottom: 36, maxWidth: 650, lineHeight: 1.6 }}>
            Gain hands-on corporate engineering exposure. Work under senior tech leads, build live systems, and secure full-time Pre-Placement Offers (PPOs).
          </p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { icon: <ClockCircleOutlined />, value: "3 Months", label: "Structured Duration" },
              { icon: <DollarOutlined />, value: "Stipend Assured", label: "Up to ₹15,000 / month" },
              { icon: <LaptopOutlined />, value: "Remote & Hybrid", label: "Flexible locations" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontSize: 18 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks section */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>
              Why Intern at Algonex?
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 600, margin: "0 auto" }}>
              Unlike dummy academy setups, we treat you as full-fledged software engineers from Day One.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {[
              { icon: <BuildOutlined style={{ fontSize: 24, color: "#0284c7" }} />, title: "Production Code Deployment", desc: "You write real scripts, test cases, and components that get checked into our central codebase and hit production servers." },
              { icon: <TeamOutlined style={{ fontSize: 24, color: "#0284c7" }} />, title: "Weekly Agile Sprints", desc: "Join daily standups, manage board tickets, receive review PR feedback from Tech Leads, and deliver milestone demos." },
              { icon: <FileTextOutlined style={{ fontSize: 24, color: "#0284c7" }} />, title: "Certificate & LOR", desc: "Earn a high-value Experience Certificate alongside a Personalized Letter of Recommendation (LOR) highlighting your specific project wins." },
            ].map((p, i) => (
              <Col xs={24} md={8} key={i}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,0.03)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.01)",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div style={{ marginBottom: 16 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Available Openings */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 36, textAlign: "center" }}>
            Active Internship Openings
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
          ) : internships.length > 0 ? (
            <Row gutter={[24, 24]}>
              {internships.map((program) => {
                const deadline = program.application_deadline ? new Date(program.application_deadline) : null;
                const isAccepting = program.is_accepting ?? (deadline && deadline >= new Date());
                return (
                  <Col key={program.id || program.slug} xs={24} sm={12} lg={8}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                          <img
                            alt={program.title}
                            src={getImageUrl(program.image)}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <Tag color="blue" style={{ position: "absolute", top: 12, left: 12, margin: 0 }}>
                            Internship
                          </Tag>
                          {program.is_featured && (
                            <Tag color="gold" style={{ position: "absolute", top: 12, right: 12, margin: 0 }}>
                              Featured
                            </Tag>
                          )}
                        </div>
                      }
                      style={{ height: "100%", borderRadius: 12, overflow: "hidden" }}
                    >
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>{program.title}</h3>
                      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
                        {(program.description || "").substring(0, 120)}{program.description?.length > 120 ? "..." : ""}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                        <span><ClockCircleOutlined /> {program.duration}</span>
                        {program.stipend && <span><DollarOutlined /> {program.stipend}</span>}
                        <span>
                          {program.is_remote ? <><LaptopOutlined /> Remote</> : <><EnvironmentOutlined /> {program.location}</>}
                        </span>
                        {deadline && (
                          <span>
                            <CalendarOutlined /> Deadline: {deadline.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                        <TeamOutlined style={{ color: "#0284c7" }} />
                        <span style={{ fontSize: 13, color: "#0284c7", fontWeight: 500 }}>
                          {program.registration_count || 0} registered
                        </span>
                        {!isAccepting && (
                          <Tag color="red" style={{ marginLeft: "auto" }}>Closed</Tag>
                        )}
                      </div>
                      <Button
                        type="primary"
                        block
                        onClick={() => handleApplyClick(program.title)}
                        disabled={!isAccepting}
                      >
                        Apply Now <ArrowRightOutlined />
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty description="No active internships available at the moment" style={{ padding: 60 }} />
          )}
        </div>
      </section>

      {/* Process Section */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>
              Our Selection Process
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 600, margin: "0 auto" }}>
              We follow a highly transparent, 4-step recruitment process to enroll candidates.
            </p>
          </div>
          <Row gutter={[24, 24]}>
            {STEPS.map((step, idx) => (
              <Col xs={24} md={12} lg={6} key={idx}>
                <div
                  style={{
                    background: "white",
                    padding: 28,
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,0.03)",
                    height: "100%",
                  }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0284c7", marginBottom: 12 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 36, textAlign: "center" }}>
            Internship FAQs
          </h2>
          <Collapse
            accordion
            items={FAQS}
            style={{ background: "transparent", border: "none" }}
          />
        </div>
      </section>

      {/* Application Modal */}
      <Modal
        title={`Apply for Internship`}
        open={applyModalOpen}
        onCancel={() => setApplyModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        style={{ borderRadius: 16 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApplySubmit}
          style={{ marginTop: 20 }}
          requiredMark={false}
        >
          <Form.Item
            label="Internship Track Selected"
            name="internshipTrack"
          >
            <Input disabled style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your full name" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input placeholder="Enter your email" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Contact Number"
            name="phone"
            rules={[{ required: true, message: "Please enter your contact number" }]}
          >
            <Input placeholder="Enter phone number" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Resume Link (Google Drive/GitHub/Dropbox)"
            name="resume"
            rules={[{ required: true, message: "Please provide your resume link" }]}
          >
            <Input placeholder="Paste your resume URL" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={submitting} style={{ height: 46, borderRadius: 8, fontWeight: 600 }}>
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
