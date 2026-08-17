import { useState, useEffect } from "react";
import { Input, Row, Col, Tag, Spin, Collapse, Button, Card, Form, message } from "antd";
import {
  SearchOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  CodeOutlined,
  UserSwitchOutlined,
  ThunderboltOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { coursesAPI } from "../../api/courses";
import { STACKS } from "../../constants/constant";
import CourseCard from "../../components/courses/CourseCard";

const PEDAGOGY = [
  {
    icon: <CodeOutlined style={{ fontSize: 24, color: "#00B4D8" }} />,
    title: "Hands-on Live Coding",
    desc: "We don't just lecture. Every session includes collaborative code-alongs, live-debugged sandbox projects, and production deployments.",
  },
  {
    icon: <UserSwitchOutlined style={{ fontSize: 24, color: "#00B4D8" }} />,
    title: "1-on-1 Support Desk",
    desc: "Get stuck on an issue? Our dedicated teaching assistants are available daily to jump on screen shares and clear your blockers.",
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: 24, color: "#00B4D8" }} />,
    title: "Industry Pedagogy",
    desc: "Our curriculum is designed by practitioners from Microsoft, Amazon, and leading startups, keeping it relevant and advanced.",
  },
  {
    icon: <TrophyOutlined style={{ fontSize: 24, color: "#00B4D8" }} />,
    title: "Placement Masterclass",
    desc: "Get resume screening, profile building on Github/LinkedIn, mock tech interviews, and referrals to our 100+ partner network.",
  },
];

const FAQS = [
  {
    key: "1",
    label: "Who is eligible for these training programs?",
    children: "Our training tracks are open to university students, fresh graduates, and working professionals looking to transition to core software and data engineering roles.",
  },
  {
    key: "2",
    label: "Will I receive a certificate upon completion?",
    children: "Yes! You will receive an Algonex Certified Professional Certificate, along with a secure, shareable digital credential link for LinkedIn and resumes.",
  },
  {
    key: "3",
    label: "Is there mock interview practice included?",
    children: "Absolutely. We conduct 3+ dedicated mock interviews with senior engineers and provide granular performance reports before referring you to partner hiring partners.",
  },
  {
    key: "4",
    label: "What is the training schedule?",
    children: "Classes are held on weekends (Saturdays & Sundays) with active labs, and regular live doubt sessions scheduled during weekday evenings.",
  },
];

export default function TrainingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    coursesAPI.list()
      .then((res) => {
        const results = res.data?.data?.results || res.data?.results || [];
        if (results.length > 0) {
          setCourses(results);
          setUsingApi(true);
        } else {
          setCourses(STACKS);
        }
      })
      .catch(() => {
        setCourses(STACKS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCallbackSubmit = (_values) => {
    message.success("Thank you! Our academic counselor will call you within 24 hours.");
    form.resetFields();
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #0c1222 0%, #0a2540 50%, #0e3a5e 100%)",
          padding: "70px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 350,
            height: 350,
            background: "radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Tag color="cyan" style={{ fontSize: 13, padding: "4px 12px", borderRadius: 20, marginBottom: 16 }}>
            Algonex Training Academy
          </Tag>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 800, color: "white", marginBottom: 16, lineHeight: 1.2 }}>
            Master High-Demand Tech Skills. <br />
            <span style={{ color: "#00B4D8" }}>Launch Your Tech Career.</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 36, maxWidth: 650, lineHeight: 1.6 }}>
            Accelerate your professional growth with our certified, hands-on development programs. Led by industry practitioners, built for top placements.
          </p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { icon: <BookOutlined />, value: "Premium Curriculums", label: "Full Stack, AI, Systems" },
              { icon: <TeamOutlined />, value: "1-on-1 Mentorship", label: "Clear blockers instantly" },
              { icon: <TrophyOutlined />, value: "Top-Tier Placements", label: "95% successful outcomes" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,180,216,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00B4D8", fontSize: 18 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pedagogy Section */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>
              The Algonex Training Pedagogy
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 600, margin: "0 auto" }}>
              How we train developers to meet rigorous corporate tech standards and outshine in technical hiring cycles.
            </p>
          </div>
          <Row gutter={[24, 24]}>
            {PEDAGOGY.map((item, idx) => (
              <Col xs={24} md={12} lg={6} key={idx}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,0.04)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.01)",
                  }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div style={{ marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Courses Catalog */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>
                Available Training Courses
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
                Select an industry certification track to build your foundation.
              </p>
            </div>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 300, borderRadius: 10 }}
              size="large"
              allowClear
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
          ) : filteredCourses.length > 0 ? (
            <Row gutter={[24, 28]}>
              {filteredCourses.map((course) => (
                <Col key={course.id || course.slug} xs={24} sm={12} lg={8} xl={6}>
                  <CourseCard course={course} useSlug={usingApi} />
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 16, color: "#64748b" }}>No training programs found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ & Quick Call Request */}
      <section style={{ padding: "80px 24px", background: "#f8fafc", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={14}>
              <h2 style={{ fontSize: 30, fontWeight: 800, color: "#1e293b", marginBottom: 28 }}>
                Frequently Asked Questions
              </h2>
              <Collapse
                accordion
                items={FAQS}
                style={{ background: "transparent", border: "none" }}
              />
            </Col>

            <Col xs={24} lg={10}>
              <div
                style={{
                  background: "white",
                  padding: "36px 32px",
                  borderRadius: 20,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "inline-flex", padding: 10, background: "rgba(0,180,216,0.08)", borderRadius: 12, color: "#00B4D8", marginBottom: 16 }}>
                  <PhoneOutlined style={{ fontSize: 20 }} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                  Talk to our Academic Advisor
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.5 }}>
                  Confused which training track fits your goals? Let our career specialists design a personalized learning map for you.
                </p>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleCallbackSubmit}
                  requiredMark={false}
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Please input your name!" }]}
                  >
                    <Input placeholder="Full Name" size="large" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
                  >
                    <Input placeholder="Email Address" size="large" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    rules={[{ required: true, message: "Please input your phone number!" }]}
                  >
                    <Input placeholder="Phone Number" size="large" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" block size="large" style={{ height: 46, borderRadius: 8, fontWeight: 600 }}>
                      Request Callback
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}
