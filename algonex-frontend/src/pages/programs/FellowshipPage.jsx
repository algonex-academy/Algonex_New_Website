import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Tag, Button, Input, Row, Col, Empty, Spin, Collapse, Form, Modal, message } from "antd";
import {
  LaptopOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { programsAPI, getApiErrorMessage } from "../../api/programs";
import { getImageUrl } from "../../utils/image";

const MOCK_FELLOWSHIPS = [
  {
    id: 1,
    title: "AI/ML Fellowship Program",
    slug: "ai-ml-fellowship",
    program_type: "fellowship",
    description: "A 6-month intensive fellowship in artificial intelligence and machine learning with hands-on projects, mentorship from industry experts, and a guaranteed stipend.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop",
    duration: "6 months",
    stipend: "₹25,000/month",
    location: "Bangalore",
    is_remote: false,
    application_deadline: "2026-06-30",
    start_date: "2026-07-15",
    is_featured: true,
    registration_count: 42,
    is_accepting: true,
  },
  {
    id: 3,
    title: "Data Engineering Fellowship",
    slug: "data-engineering-fellowship",
    program_type: "fellowship",
    description: "Build scalable data pipelines with Apache Spark, Airflow, and modern data stack tools. Includes real-world projects with partner companies.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop",
    duration: "4 months",
    stipend: "₹20,000/month",
    location: "Hyderabad",
    is_remote: false,
    application_deadline: "2026-06-20",
    start_date: "2026-07-05",
    is_featured: false,
    registration_count: 23,
    is_accepting: true,
  },
  {
    id: 5,
    title: "Cybersecurity Fellowship",
    slug: "cybersecurity-fellowship",
    program_type: "fellowship",
    description: "Advanced fellowship covering penetration testing, threat modeling, incident response, and security architecture. Certification prep included.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop",
    duration: "5 months",
    stipend: "₹22,000/month",
    location: "Remote",
    is_remote: true,
    application_deadline: "2026-07-10",
    start_date: "2026-08-01",
    is_featured: false,
    registration_count: 15,
    is_accepting: true,
  },
];

const PATHS = [
  {
    icon: <RocketOutlined style={{ fontSize: 24, color: "#a855f7" }} />,
    title: "AI/ML Research & NLP",
    desc: "Dive deep into modern transformers, neural architectures, LLM fine-tuning methodologies, vector databases, and reinforcement learning.",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: "#a855f7" }} />,
    title: "High-Frequency & Systems",
    desc: "Build ultra-low latency ingestion models, custom network layers, high-throughput caching, and complex concurrent systems in modern C++.",
  },
  {
    icon: <BookOutlined style={{ fontSize: 24, color: "#a855f7" }} />,
    title: "Big Data & Pipelines",
    desc: "Design lakehouses, partition massive real-time datasets with Apache Kafka & Spark, and create reliable DBT transformations at petabyte scales.",
  },
];

const SELECTION = [
  { step: "01", name: "Strict Profile Screen", text: "We review GitHub profiles, personal projects, and technical achievements. Only 5% move forward." },
  { step: "02", name: "Algorithm Battle", text: "A 90-minute online coding challenge covering algorithmic depth and complexity analysis." },
  { step: "03", name: "System Design Challenge", text: "Interactive live review where you sketch distributed architectures, query patterns, and trade-offs." },
  { step: "04", name: "Panel Selection", text: "A comprehensive depth review with our PhD research advisors and Tech leads before final matching." },
];

const FAQS = [
  {
    key: "1",
    label: "Who is the ideal candidate for the Algonex Fellowship?",
    children: "We select exceptional computer science graduates, competitive programmers, research enthusiasts, and engineers with robust system-level projects.",
  },
  {
    key: "2",
    label: "Is the stipend guaranteed?",
    children: "Yes! Every selected fellow receives a guaranteed monthly stipend of up to ₹25,000/month throughout the fellowship term, financed directly by Algonex.",
  },
  {
    key: "3",
    label: "Do we publish research papers?",
    children: "Absolutely. Fellowship tracks provide dedicated collaboration channels under academic mentors to publish results in internationally recognized conferences (like NeurIPS, IEEE, or CVPR).",
  },
  {
    key: "4",
    label: "What happens after the fellowship completes?",
    children: "Fellows either secure direct placements at our high-growth partner companies with packages exceeding 12+ LPA, transition to full-time R&D roles inside Algonex, or progress to prestigious graduate studies.",
  },
];

export default function FellowshipPage() {
  const [fellowships, setFellowships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [, setSelectedTrack] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    programsAPI.list()
      .then((res) => {
        const results = res.data?.data?.results || res.data?.results || [];
        const filtered = results.filter((p) => p.program_type === "fellowship");
        if (filtered.length > 0) {
          setFellowships(filtered);
        } else {
          setFellowships(MOCK_FELLOWSHIPS);
        }
      })
      .catch(() => {
        setFellowships(MOCK_FELLOWSHIPS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApplyClick = (trackName) => {
    setSelectedTrack(trackName);
    form.setFieldsValue({ fellowshipTrack: trackName });
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (values) => {
    setSubmitting(true);
    try {
      await programsAPI.submitLead({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        subject: `Fellowship Application: ${values.fellowshipTrack || "General"}`,
        course_interested: values.fellowshipTrack || "",
        message: `Fellowship application.\nTrack: ${values.fellowshipTrack || "Not specified"}\nGitHub: ${values.github}\nResume: ${values.resume}`,
      });
      message.success(`Elite Application for ${values.fellowshipTrack} registered! Our admissions committee will reach out.`);
      setApplyModalOpen(false);
      form.resetFields();
    } catch (err) {
      message.error(getApiErrorMessage(err, "Could not submit your application. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#09090b", color: "#fafafa", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #311042 100%)",
          padding: "90px 24px 100px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Tag color="purple" style={{ fontSize: 13, padding: "4px 14px", borderRadius: 20, marginBottom: 20, color: "#d8b4fe", borderColor: "#c084fc", background: "rgba(168,85,247,0.15)" }}>
            Selective Core R&D Fellowship
          </Tag>
          <h1 style={{ fontSize: "clamp(30px, 7vw, 52px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.1, color: "#fff", letterSpacing: "-0.02em" }}>
            The Algonex Elite <br />
            <span style={{ background: "linear-gradient(to right, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Technical Fellowship
            </span>
          </h1>
          <p style={{ fontSize: 18, color: "#a1a1aa", marginBottom: 40, maxWidth: 680, lineHeight: 1.7 }}>
            A premier 6-month, mentor-driven research and engineering fellowship for high-potential minds. Work with PhD developers, publish research, and build core tech.
          </p>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
            {[
              { icon: <ClockCircleOutlined />, value: "6 Months R&D", label: "Intensive Engagement" },
              { icon: <DollarOutlined />, value: "₹25,000 / mo", label: "Guaranteed Stipend" },
              { icon: <LaptopOutlined />, value: "Publication Focus", label: "NeurIPS / IEEE support" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc", fontSize: 20 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 800, fontSize: 16 }}>{s.value}</div>
                  <div style={{ color: "#a1a1aa", fontSize: 13 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Paths */}
      <section style={{ padding: "80px 24px", background: "#09090b", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 12 }}>
              Elite Fellowship Paths
            </h2>
            <p style={{ fontSize: 16, color: "#a1a1aa", maxWidth: 600, margin: "0 auto" }}>
              Tailor-made pipelines working on real problems under leading engineering mentors.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {PATHS.map((p, i) => (
              <Col xs={24} md={8} key={i}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "white",
                  }}
                  styles={{ body: { padding: 32 } }}
                >
                  <div style={{ marginBottom: 20 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: "white", marginBottom: 12 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Available Fellowships */}
      <section style={{ padding: "80px 24px", background: "#09090b", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 40, textAlign: "center" }}>
            Available Fellowships
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
          ) : fellowships.length > 0 ? (
            <Row gutter={[24, 24]}>
              {fellowships.map((program) => {
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
                          <Tag color="purple" style={{ position: "absolute", top: 12, left: 12, margin: 0, textTransform: "capitalize" }}>
                            {program.program_type}
                          </Tag>
                          {program.is_featured && (
                            <Tag color="gold" style={{ position: "absolute", top: 12, right: 12, margin: 0 }}>
                              Featured
                            </Tag>
                          )}
                        </div>
                      }
                      style={{
                        height: "100%",
                        borderRadius: 16,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.01)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "white" }}>{program.title}</h3>
                      <p style={{ color: "#a1a1aa", fontSize: 14, marginBottom: 16 }}>
                        {(program.description || "").substring(0, 120)}{program.description?.length > 120 ? "..." : ""}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, color: "#a1a1aa", fontSize: 13, marginBottom: 16 }}>
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
                        <TeamOutlined style={{ color: "#c084fc" }} />
                        <span style={{ fontSize: 13, color: "#c084fc", fontWeight: 500 }}>
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
                        style={{ background: "#c084fc", borderColor: "#a855f7", color: "#000", fontWeight: 600 }}
                      >
                        Apply for Fellowship <ArrowRightOutlined />
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty description="No fellowships match your filters" style={{ padding: 80 }} />
          )}
        </div>
      </section>

      {/* Rigorous Selection */}
      <section style={{ padding: "80px 24px", background: "#09090b", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 12 }}>
              A Highly Selective Process
            </h2>
            <p style={{ fontSize: 16, color: "#a1a1aa", maxWidth: 600, margin: "0 auto" }}>
              Our assessment steps evaluate technical foundations, analytical grit, and research aspirations.
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {SELECTION.map((sel, idx) => (
              <Col xs={24} md={12} lg={6} key={idx}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    padding: 30,
                    borderRadius: 16,
                    height: "100%",
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#a855f7", marginBottom: 12, opacity: 0.6 }}>
                    {sel.step}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 10 }}>{sel.name}</h3>
                  <p style={{ fontSize: 13.5, color: "#a1a1aa", lineHeight: 1.6, margin: 0 }}>{sel.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px", background: "#09090b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 36, textAlign: "center" }}>
            Fellowship FAQs
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
        title={`Apply for Fellowship`}
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
            label="Fellowship Track Selected"
            name="fellowshipTrack"
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
            label="Github Profile URL"
            name="github"
            rules={[{ required: true, message: "Please provide your GitHub URL" }]}
          >
            <Input placeholder="https://github.com/username" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Resume Link (Google Drive/GitHub/Dropbox)"
            name="resume"
            rules={[{ required: true, message: "Please provide your resume link" }]}
          >
            <Input placeholder="Paste your resume URL" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={submitting} style={{ height: 46, borderRadius: 8, fontWeight: 600, background: "#a855f7", borderColor: "#a855f7" }}>
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
