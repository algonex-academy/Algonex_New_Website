import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Rate, Button, Card, Row, Col, Carousel, Avatar, Empty, Modal, App, Spin, Collapse } from "antd";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { coursesAPI } from "../../api/courses";
import { STACKS } from "../../constants/constant";
import CourseCard from "../../components/courses/CourseCard";
import CourseRoadmap from "../../components/courses/CourseRoadmap";
import { useAuth } from "../../hooks/useAuth";

export default function CourseDetailPage() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const { message } = App.useApp();

  // Reset all state when navigating between courses
  useEffect(() => {
    setCourse(null);
    setLoading(true);
    setEnrolled(false);
    setEnrollLoading(false);
    setShowEnrollModal(false);
    setShowSigninModal(false);
  }, [slug, id]);

  // Fetch course from API
  useEffect(() => {
    const fetchCourse = async () => {
      let courseSlug = slug;

      // If on /stack/:id route, look up slug from static data
      if (!courseSlug && id) {
        const staticCourse = STACKS.find((c) => c.id === parseInt(id));
        if (staticCourse) {
          courseSlug = staticCourse.name.toLowerCase().replace(/\s+/g, "-");
        }
      }

      if (courseSlug) {
        try {
          const res = await coursesAPI.detail(courseSlug);
          const data = res.data?.data || res.data;
          setCourse(data);
          if (data.is_enrolled) setEnrolled(true);
          setLoading(false);
          return;
        } catch {
          // API failed, fall back to static
        }
      }

      // Fallback to static data
      if (id) {
        setCourse(STACKS.find((c) => c.id === parseInt(id)) || null);
      } else {
        setCourse(null);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [slug, id]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      setShowSigninModal(true);
      return;
    }
    setShowEnrollModal(true);
  };

  const confirmEnroll = async () => {
    const courseSlug = course.slug || course.name?.toLowerCase().replace(/\s+/g, "-");
    if (!courseSlug) {
      message.error("Cannot enroll — course data is incomplete.");
      return;
    }
    setEnrollLoading(true);
    try {
      await coursesAPI.enroll(courseSlug);
      setEnrolled(true);
      setShowEnrollModal(false);
      message.success("Successfully enrolled!");
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || "Enrollment failed.";
      message.error(errMsg);
      setShowEnrollModal(false);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 100 }}><Spin size="large" /></div>;
  }

  if (!course) {
    return (
      <div style={{ padding: 80, textAlign: "center" }}>
        <Empty description="Course not found" />
        <Button type="primary" onClick={() => navigate("/allcourses")} style={{ marginTop: 16 }}>
          Browse Courses
        </Button>
      </div>
    );
  }

  const discountNum = parseInt(course.discount) || 0;
  const priceNum = parseInt(course.price) || 0;
  const discountedPrice = discountNum > 0 ? Math.round(priceNum * (1 - discountNum / 100)) : priceNum;
  const trendingCourses = STACKS.filter((c) => (c.isTrending || c.is_trending) && c.id !== course.id).slice(0, 4);

  // Normalize field names: the API sends average_rating / review_count /
  // student_count / faqs / top-level level & prior_knowledge, while static
  // STACKS data uses rating / reviews (number) / students / faq / recommended.
  const rating = course.average_rating ?? course.rating ?? 0;
  const reviewCount = course.review_count
    ?? (Array.isArray(course.reviews) ? course.reviews.length : course.reviews)
    ?? 0;
  const studentCount = course.student_count ?? course.students ?? 0;
  const level = course.level || course.recommended?.level;
  const priorKnowledge = course.prior_knowledge || course.recommended?.prior_knowledge;
  const faqs = Array.isArray(course.faqs) && course.faqs.length > 0
    ? course.faqs
    : (Array.isArray(course.faq) ? course.faq : []);
  // API reviews/testimonials are arrays of feedback objects; static data only
  // has testimonials. Merge both into one list for the reviews carousel.
  const studentReviews = [
    ...(Array.isArray(course.testimonials) ? course.testimonials : []),
    ...(Array.isArray(course.reviews) ? course.reviews : []),
  ];

  return (
    <div style={{ background: "#f8fafc" }}>
      {/* Banner */}
      <div
        style={{
          position: "relative",
          minHeight: 320,
          background: `linear-gradient(135deg, rgba(0,180,216,0.85), rgba(8,145,178,0.9)), url(${course.banner}) center/cover`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", color: "white" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ color: "white", marginBottom: 16, padding: 0 }}
          >
            Back
          </Button>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Tag color="cyan">{level || "All Levels"}</Tag>
            {(course.isTrending || course.is_trending) && <Tag color="magenta">Trending</Tag>}
            <Tag color="green">{course.duration}</Tag>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 6vw, 40px)", fontWeight: 700, color: "white", marginBottom: 12 }}>
            {course.name}
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", maxWidth: 600, marginBottom: 24 }}>
            {course.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Rate disabled defaultValue={Number(rating) || 0} allowHalf style={{ fontSize: 16 }} />
              <span style={{ color: "rgba(255,255,255,0.8)" }}>({reviewCount} reviews)</span>
            </span>
            <span><UserOutlined /> {Number(studentCount).toLocaleString()} students</span>
            <span><BookOutlined /> {course.modules?.length} modules</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ maxWidth: 1200, margin: "-40px auto 0", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <Card style={{ borderRadius: 16 }}>
          <Row gutter={[24, 16]} justify="space-around" align="middle">
            <Col>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#00B4D8" }}>
                  ₹{discountedPrice.toLocaleString()}
                </div>
                {discountNum > 0 && (
                  <div style={{ textDecoration: "line-through", color: "#999", fontSize: 14 }}>
                    ₹{priceNum.toLocaleString()}
                  </div>
                )}
                <div style={{ color: "#888", fontSize: 12 }}>Price</div>
              </div>
            </Col>
            <Col>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{course.duration}</div>
                <div style={{ color: "#888", fontSize: 12 }}>Duration</div>
              </div>
            </Col>
            <Col>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{level || "All Levels"}</div>
                <div style={{ color: "#888", fontSize: 12 }}>Level</div>
              </div>
            </Col>
            <Col>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{rating || "—"}</div>
                <div style={{ color: "#888", fontSize: 12 }}>Rating</div>
              </div>
            </Col>
            <Col>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{course.modules?.length}</div>
                <div style={{ color: "#888", fontSize: 12 }}>Modules</div>
              </div>
            </Col>
            <Col>
              {enrolled ? (
                <Button size="large" style={{ height: 48, fontSize: 16, borderRadius: 8, background: "#22c55e", color: "white", border: "none" }} icon={<CheckCircleOutlined />}>
                  Enrolled
                </Button>
              ) : (
                <Button type="primary" size="large" onClick={handleEnroll} style={{ height: 48, fontSize: 16, borderRadius: 8 }}>
                  Enroll Now
                </Button>
              )}
            </Col>
          </Row>
        </Card>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#2c3e50" }}>
              Skills You'll Learn
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {course.skills.map((skill, idx) => (
                <Tag
                  key={skill.id || idx}
                  color="cyan"
                  style={{ padding: "4px 16px", fontSize: 14, borderRadius: 20 }}
                >
                  {typeof skill === "string" ? skill : skill.name}
                </Tag>
              ))}
            </div>
          </section>
        )}

        {/* Learning Path Roadmap */}
        {course.modules && course.modules.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#2c3e50", marginBottom: 24, textAlign: "center" }}>
              Your Learning Path
            </h2>
            <CourseRoadmap modules={course.modules} />
          </div>
        )}

        {/* Prior Knowledge */}
        {priorKnowledge && (
          <section style={{ marginBottom: 40 }}>
            <Card style={{ borderRadius: 12, background: "#EBFBFF", border: "1px solid #CCF6FF" }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                <TrophyOutlined style={{ color: "#00B4D8", marginRight: 8 }} />
                Prerequisites
              </h3>
              <p style={{ color: "#555", margin: 0 }}>{priorKnowledge}</p>
            </Card>
          </section>
        )}

        {/* Testimonials & Student Reviews */}
        {studentReviews.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#2c3e50" }}>
              Student Reviews
            </h2>
            <Carousel autoplay dots={{ className: "custom-dots" }} slidesToShow={Math.min(studentReviews.length, 3)} responsive={[
              { breakpoint: 768, settings: { slidesToShow: 1 } },
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
            ]}>
              {studentReviews.map((t, idx) => (
                <div key={t.id || idx} style={{ padding: "0 8px" }}>
                  <Card style={{ borderRadius: 12, margin: "0 8px", height: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <Avatar size={48} src={t.image} icon={<UserOutlined />} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.student_name || t.name || "Anonymous"}</div>
                        {t.role && <div style={{ color: "#888", fontSize: 13 }}>{t.role}</div>}
                      </div>
                    </div>
                    <Rate disabled defaultValue={Number(t.rating) || 0} style={{ fontSize: 14, marginBottom: 8 }} />
                    {t.text && (
                      <p style={{ color: "#555", fontStyle: "italic", margin: 0 }}>"{t.text}"</p>
                    )}
                  </Card>
                </div>
              ))}
            </Carousel>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#2c3e50" }}>
              Frequently Asked Questions
            </h2>
            <Collapse
              accordion
              expandIconPosition="end"
              items={faqs.map((f, idx) => ({
                key: f.id || idx,
                label: <span style={{ fontWeight: 500, fontSize: 15 }}>{f.question}</span>,
                children: <div className="md-content"><Markdown remarkPlugins={[remarkGfm]}>{f.answer}</Markdown></div>,
              }))}
            />
          </section>
        )}

        {/* Trending Courses */}
        {trendingCourses.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#2c3e50" }}>
              Other Courses You Might Like
            </h2>
            <Row gutter={[24, 24]}>
              {trendingCourses.map((c) => (
                <Col key={c.id} xs={24} sm={12} lg={6}>
                  <CourseCard course={c} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </div>

      {/* Enroll Confirmation Modal */}
      <Modal
        title={`Enroll in ${course.name}?`}
        open={showEnrollModal}
        onOk={confirmEnroll}
        onCancel={() => setShowEnrollModal(false)}
        okText="Confirm Enrollment"
        confirmLoading={enrollLoading}
      >
        <p>You're about to enroll in this {course.duration} course.</p>
      </Modal>

      {/* Sign In Required Modal */}
      <Modal
        title="Sign in required"
        open={showSigninModal}
        onOk={() => {
          setShowSigninModal(false);
          navigate("/signin", { state: { from: { pathname: `/stack/${id}` } } });
        }}
        onCancel={() => setShowSigninModal(false)}
        okText="Sign In"
      >
        <p>You need to sign in before enrolling in a course.</p>
      </Modal>
    </div>
  );
}
