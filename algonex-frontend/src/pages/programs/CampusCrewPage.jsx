import React, { useState } from 'react';
import { Card, Tag, Button, Row, Col, Collapse, Modal, Form, Input, message } from 'antd';
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  UserOutlined,
  BankOutlined,
  SolutionOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  SearchOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  LaptopOutlined,
  GlobalOutlined

} from '@ant-design/icons';
import InteractiveEcosystem from '../../components/campus-crew/InteractiveEcosystem';
import EventsSection from '../../components/Pages/Events';
import heroVideo from '../../assets/videos/campus-crew-hero.mp4';

import {
  partnerEcosystem,
  classroomVsIndustry,
  fivePillars,
  studentBenefits,
  studentJourneyTimeline,
  immersionDaySchedule,
  engineeringPipeline,
  techTracks,
  industryExperts,
  collegeBenefits,
  leadershipRoles,
  verifiedFaqs
} from '../../data/campusCrewData';

export default function CampusCrewPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFormType, setModalFormType] = useState('student');
  const [activeAudience, setActiveAudience] = useState('student');
  const [faqSearch, setFaqSearch] = useState('');
  const [form] = Form.useForm();

  const handleOpenModal = (type) => {
    setModalFormType(type);
    form.resetFields();
    setModalOpen(true);
  };

  const handleFormSubmit = (values) => {
    message.success(`Application submitted for ${values.name || 'your response'}! Our team will contact you shortly.`);
    setModalOpen(false);
    form.resetFields();
  };

  const filteredFaqs = verifiedFaqs.filter(
    item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
            item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div style={{ background: "#f8fafc", color: "#2c3e50", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      
      {/* 01 HERO SECTION — Video Background (Muted Audio) */}
      <section
        style={{
          minHeight: 560,
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          background: "#0c1222",
          padding: "clamp(32px, 5vw, 64px) 24px",
        }}
      >
        {/* Background Video (High Visibility, Subtle 2px Blur) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.85,
            filter: "blur(2px)",
            transform: "scale(1.02)", // Prevents edge blur clipping
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Subtle Dark Overlay for Legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(12, 18, 34, 0.45) 0%, rgba(10, 37, 64, 0.5) 50%, rgba(14, 58, 94, 0.55) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Background Glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2, width: "100%" }}>
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} lg={13}>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(0,180,216,0.15)",
                  border: "1px solid rgba(0,180,216,0.3)",
                  borderRadius: 20,
                  padding: "6px 16px",
                  color: "#66E5FF",
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 20,
                }}
              >
                ALGONEX CAMPUS CREW
              </div>
              <h1 style={{ fontSize: "clamp(28px, 5.5vw, 44px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 18 }}>
                Building India's Industry-to-Campus{" "}
                <span style={{ color: "#00B4D8" }}>Innovation Network</span>
              </h1>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#66E5FF", marginBottom: 12 }}>
                Learn. Build. Innovate. Connect. Lead.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: 28, maxWidth: 540 }}>
                Join as a student or connect your college with Algonex Campus Crew to bridge classroom learning with industry software practice.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                <Button type="primary" size="large" icon={<BankOutlined />} onClick={() => window.location.href = '/campus-crew/register/college'} style={{ height: 48, fontSize: 15, borderRadius: 8, background: '#00B4D8' }}>
                  I Represent a College
                </Button>
                <Button size="large" ghost icon={<UserOutlined />} onClick={() => window.location.href = '/campus-crew/register/student'} style={{ height: 48, fontSize: 15, borderRadius: 8, color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                  I'm a Student
                </Button>
              </div>


              {/* Quick Stat Highlights */}
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { value: "50 Cohort", label: "Members / Campus" },
                  { value: "Industry", label: "Architect Mentors" },
                  { value: "Hackathons", label: "Deployed Demos" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#66E5FF" }}>{s.value}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Col>
            
            {/* Right Side: Interactive Ecosystem Visualizer */}
            <Col xs={24} lg={11}>
              <InteractiveEcosystem />
            </Col>
          </Row>
        </div>
      </section>

      {/* 34 AUDIENCE SELECTOR PERSPECTIVE TOGGLE */}
      <section style={{ padding: "36px 24px", background: "#ffffff", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>
            SELECT YOUR PERSPECTIVE TO CUSTOMIZE THE EXPERIENCE
          </div>
          <Row gutter={[16, 16]}>
            {[
              { id: 'student', targetId: 'classroom-foundation', title: "I'M A STUDENT", sub: 'Join the Cohort & Build', icon: <UserOutlined style={{ fontSize: 20 }} /> },
              { id: 'college', targetId: 'student-benefits', title: "I'M A COLLEGE OFFICIAL", sub: 'Bring Algonex to Campus', icon: <BankOutlined style={{ fontSize: 20 }} /> },
              { id: 'industry', targetId: 'industry-immersion', title: "I'M AN INDUSTRY PARTNER", sub: 'Mentor & Access Talent', icon: <SolutionOutlined style={{ fontSize: 20 }} /> },
            ].map((aud) => (
              <Col xs={24} md={8} key={aud.id}>
                <div
                  onClick={() => {
                    setActiveAudience(aud.id);
                    const el = document.getElementById(aud.targetId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    padding: "16px 20px",
                    borderRadius: 12,
                    background: activeAudience === aud.id ? "#EBFBFF" : "#ffffff",
                    border: activeAudience === aud.id ? "2px solid #00B4D8" : "1px solid #e8e8e8",
                    textAlign: "center",
                    transition: "all 0.2s shadow",
                    boxShadow: activeAudience === aud.id ? "0 4px 12px rgba(0,180,216,0.12)" : "none"
                  }}
                >
                  <div style={{ color: activeAudience === aud.id ? "#00B4D8" : "#64748b", marginBottom: 6 }}>{aud.icon}</div>
                  <div style={{ fontWeight: 800, color: "#2c3e50", fontSize: 14 }}>{aud.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{aud.sub}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* FULL EVENTS SECTION FROM /events */}
      <section id="events" style={{ borderBottom: "1px solid #e8e8e8" }}>
        <EventsSection />
      </section>





      {/* 10 THE GAP: CLASSROOM VS INDUSTRY */}
      <section id="classroom-foundation" style={{ padding: "64px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Tag color="cyan" style={{ fontSize: 12, borderRadius: 12, marginBottom: 8, fontWeight: 600 }}>REALITY CHECK</Tag>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#2c3e50", marginBottom: 8 }}>
            The Classroom Builds The Foundation. <br />
            <span style={{ color: "#00B4D8" }}>Industry Demands Execution.</span>
          </h2>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title={<span style={{ fontSize: 18, fontWeight: 800, color: "#2c3e50" }}>THE CLASSROOM</span>} style={{ borderRadius: 16, height: "100%", border: "1px solid #e8e8e8" }}>
              {classroomVsIndustry.classroom.map((item, idx) => (
                <div key={idx} style={{ marginBottom: 14, padding: 12, background: "#f8fafc", borderRadius: 8 }}>
                  <div style={{ fontWeight: 700, color: "#2c3e50", fontSize: 14 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{item.detail}</div>
                </div>
              ))}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title={<span style={{ fontSize: 18, fontWeight: 800, color: "#00B4D8" }}>THE INDUSTRY</span>} style={{ borderRadius: 16, height: "100%", border: "1px solid #CCF6FF", background: "#EBFBFF" }}>
              {classroomVsIndustry.industry.map((item, idx) => (
                <div key={idx} style={{ marginBottom: 14, padding: 12, background: "#ffffff", borderRadius: 8, border: "1px solid #CCF6FF" }}>
                  <div style={{ fontWeight: 700, color: "#00B4D8", fontSize: 14 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#2c3e50", marginTop: 2 }}>{item.detail}</div>
                </div>
              ))}
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 32, padding: 24, background: "#EBFBFF", color: "#0c1222", border: "1px solid #CCF6FF", borderRadius: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#00B4D8", letterSpacing: "1px", textTransform: "uppercase" }}>THE BRIDGE</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0c1222", marginTop: 4, margin: 0 }}>
            Algonex exists to help engineering students cross this gap.
          </h3>
        </div>
      </section>

      {/* 11 FIVE PILLARS */}
      <section style={{ padding: "64px 24px", background: "#ffffff", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2c3e50", marginBottom: 8 }}>
              This Is More Than A Workshop.
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", maxWidth: 650, margin: "0 auto" }}>
              Algonex Campus Crew is an on-campus student community designed to create continuous interaction between students, colleges, and the tech industry.
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {fivePillars.map((p, idx) => (
              <Col xs={24} sm={12} md={4.8} key={idx} style={{ flex: "1" }}>
                <Card hoverable style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EBFBFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#00B4D8", fontWeight: 800, fontSize: 14, marginBottom: 14 }}>
                    0{idx + 1}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#2c3e50", marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 13 STUDENT BENEFITS */}
      <section id="student-benefits" style={{ padding: "64px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2c3e50" }}>
            What Students Actually Get
          </h2>
        </div>

        <Row gutter={[20, 20]}>
          {studentBenefits.map((b, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card hoverable style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}>
                <Tag color="cyan" style={{ fontSize: 11, borderRadius: 10, marginBottom: 10 }}>{b.badge}</Tag>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#2c3e50", marginBottom: 6 }}>{b.title}</h3>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 15 IMMERSION & PIPELINE */}
      <section id="industry-immersion" style={{ padding: "64px 24px", background: "#ffffff", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#2c3e50", marginBottom: 16 }}>
                Industry Immersion Day (~6 Hours)
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {immersionDaySchedule.map((s, idx) => (
                  <div key={idx} style={{ padding: 12, background: "#f8fafc", border: "1px solid #e8e8e8", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "#00B4D8", fontWeight: 800, fontFamily: "monospace" }}>{s.phase}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2c3e50", marginTop: 2 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.topic}</div>
                  </div>
                ))}
              </div>
            </Col>

            <Col xs={24} md={12}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#2c3e50", marginBottom: 16 }}>
                Engineering Pipeline
              </h2>
              <Row gutter={[10, 10]}>
                {engineeringPipeline.map((p, idx) => (
                  <Col xs={12} key={idx}>
                    <div style={{ padding: 12, background: "#EBFBFF", border: "1px solid #CCF6FF", borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#00B4D8" }}>{p.step}</div>
                      <div style={{ fontSize: 12, color: "#2c3e50", marginTop: 2 }}>{p.desc}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </section>



      {/* 09 TRUST & INDUSTRY NETWORK (MOVED TO BOTTOM) */}
      <section style={{ padding: "56px 24px", background: "#ffffff", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
            INDUSTRY ECOSYSTEM & SPEAKER AFFILIATIONS
          </div>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
            Relationships qualified with verified affiliation labels
          </p>

          <Row gutter={[16, 16]} justify="center">
            {partnerEcosystem.map((partner, idx) => (
              <Col xs={12} sm={8} md={3} key={idx}>
                <Card
                  hoverable
                  style={{ borderRadius: 12, border: "1px solid #e8e8e8", textAlign: "center" }}
                  styles={{ body: { padding: "16px 12px" } }}
                >
                  <img src={partner.logo} alt={partner.name} style={{ height: 32, objectFit: "contain", margin: "0 auto 8px" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#2c3e50" }}>{partner.name}</div>
                  <div style={{ fontSize: 10, color: "#00B4D8", marginTop: 2, fontWeight: 600 }}>{partner.relationshipType}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 48 VERIFIED FAQS */}
      <section style={{ padding: "64px 24px", maxWidth: 800, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2c3e50", marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          <Input
            placeholder="Search questions..."
            prefix={<SearchOutlined />}
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            style={{ borderRadius: 8, height: 40 }}
          />
        </div>
        <Collapse
          accordion
          items={filteredFaqs.map((faq, idx) => ({
            key: String(idx + 1),
            label: <span style={{ color: "#2c3e50", fontWeight: 700, fontSize: 15 }}>{faq.q}</span>,
            children: <p style={{ color: "#64748b", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{faq.a}</p>,
          }))}
          style={{ background: "#ffffff", borderRadius: 12 }}
        />
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "64px 24px", background: "#EBFBFF", borderTop: "1px solid #CCF6FF", textAlign: "center", color: "#0c1222" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0c1222", marginBottom: 12 }}>
            Ready To Bridge The Gap?
          </h2>
          <p style={{ fontSize: 16, color: "#475569", marginBottom: 28 }}>
            Join India's next industry-to-campus innovation ecosystem. Whether you represent a college, a student builder, or an industry partner, let's innovate together.
          </p>
          <div style={{ display: "flex", gap: 16, justify: "center" }}>
            <Button type="primary" size="large" onClick={() => handleOpenModal('college')} style={{ background: "#00B4D8", borderColor: "#00B4D8", fontWeight: 700, height: 44, borderRadius: 8, padding: "0 24px" }}>
              Partner With Algonex
            </Button>
            <Button size="large" onClick={() => handleOpenModal('student')} style={{ background: "#ffffff", color: "#0c1222", borderColor: "#cbd5e1", fontWeight: 700, height: 44, borderRadius: 8, padding: "0 24px" }}>
              Join Campus Crew
            </Button>
          </div>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 800, color: "#2c3e50" }}>Apply for Algonex Campus Crew</span>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} style={{ marginTop: 16 }}>
          <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="e.g. Rahul Sharma" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item label="Email Address" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
            <Input placeholder="e.g. rahul@example.com" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
            <Input placeholder="+91 9876543210" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item label="College / Institution" name="college" rules={[{ required: true, message: "Please enter your college name" }]}>
            <Input placeholder="e.g. IIT / NIT / University Name" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item label="Additional Note" name="message">
            <Input.TextArea rows={3} placeholder="Tell us how you would like to participate..." style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button type="primary" htmlType="submit" style={{ background: "#00B4D8", borderColor: "#00B4D8", fontWeight: 700, borderRadius: 6 }}>
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
