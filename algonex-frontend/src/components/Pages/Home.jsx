import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, Carousel, Tag } from "antd";
import {
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined,
  CodeOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  LaptopOutlined,
  StarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { STACKS } from "../../constants/constant";
import { coursesAPI } from "../../api/courses";
import { eventsAPI } from "../../api/events";
import { programsAPI } from "../../api/programs";
import CourseCard from "../courses/CourseCard";
import OutcomesTicker from "../OutcomesTicker";
import ProjectsSection from "../home/ProjectsSection";
import ReviewsSection from "../home/ReviewsSection";
import GallerySection from "../home/GallerySection";
import FAQSection from "../home/FAQSection";
import CircularGallery from "../home/CircularGallery";
import { commonAPI } from "../../api/common";

const stats = [
  { value: "5,000+", label: "Students Trained" },
  { value: "50+", label: "Hiring Partners" },
  { value: "95%", label: "Placement Rate" },
  { value: "4.8/5", label: "Student Rating" },
];

const features = [
  {
    icon: <CodeOutlined style={{ fontSize: 28, color: "#00B4D8" }} />,
    title: "Industry-Ready Curriculum",
    desc: "Courses designed with top tech companies to match real-world job requirements.",
  },
  {
    icon: <TeamOutlined style={{ fontSize: 28, color: "#00B4D8" }} />,
    title: "Expert Trainers",
    desc: "Learn from industry professionals with hands-on experience in real-world projects.",
  },
  {
    icon: <TrophyOutlined style={{ fontSize: 28, color: "#00B4D8" }} />,
    title: "Placement Support",
    desc: "Resume building, mock interviews, and direct referrals to our hiring partners.",
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: "#00B4D8" }} />,
    title: "Certified Programs",
    desc: "Industry-recognized certifications to validate your skills to employers.",
  },
  {
    icon: <RocketOutlined style={{ fontSize: 28, color: "#00B4D8" }} />,
    title: "Career Acceleration",
    desc: "Resume reviews, mock interviews, and direct company referrals.",
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 28, color: "#00B4D8" }} />,
    title: "Growing Community",
    desc: "Join 5,000+ trained professionals working at top companies across India.",
  },
];

const GALLERY_ITEMS = [
  {
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop",
    text: "Python Full Stack"
  },
  {
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop",
    text: "MERN Stack"
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    text: "Data Analytics"
  },
  {
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop",
    text: "DevOps & Cloud"
  },
  {
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop",
    text: "Machine Learning"
  },
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
    text: "Career Mentorship"
  }
];

// Static fallback data for each slide type
const FALLBACK_COURSE = STACKS.find((c) => c.isTrending) || STACKS[0];

const FALLBACK_EVENT = {
  title: "Full Stack Web Development Workshop",
  slug: null,
  start_date: "2026-04-15",
  end_date: "2026-04-15",
  location: "Algonex Campus, Bangalore",
  event_type: "Workshop",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop",
  capacity: 30,
  spots_left: 8,
  summary: "Hands-on workshop covering React, Node.js, and MongoDB with real-world projects.",
};

const FALLBACK_PROGRAM = {
  title: "AI/ML Fellowship Program",
  slug: "ai-ml-fellowship",
  program_type: "fellowship",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop",
  duration: "6 months",
  stipend: "\u20b925,000/month",
  location: "Bangalore",
  is_remote: false,
  application_deadline: "2026-05-15",
  start_date: "2026-06-01",
  is_featured: true,
  registration_count: 42,
  description: "A 6-month intensive fellowship in artificial intelligence and machine learning with hands-on projects, mentorship from industry experts, and a guaranteed stipend.",
};

// Shared slide background
const SLIDE_BG = "linear-gradient(135deg, #0c1222 0%, #0a2540 50%, #0e3a5e 100%)";

const slideGlow = {
  position: "absolute",
  top: -100,
  right: -100,
  width: 400,
  height: 400,
  background: "radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)",
  borderRadius: "50%",
  pointerEvents: "none",
};

/**
 * Stacked image gallery: shows images as a stacked card deck.
 * On hover, the stack cycles through images by sliding down.
 * Props:
 *   - images: array of { image, caption } or string URLs
 *   - primaryImage: fallback single image URL (used if no media array)
 *   - alt: alt text for images
 *   - onHoverStart/onHoverEnd: callbacks to pause/resume parent carousel
 */
function StackedImageGallery({ images = [], primaryImage, alt = "", onHoverStart, onHoverEnd }) {
  // Build image list: media array first, then fallback to primary image
  const allImages = images.length > 0
    ? images.map((m) => (typeof m === "string" ? m : m.image))
    : primaryImage ? [primaryImage] : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const stopCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCycling = useCallback(() => {
    if (allImages.length <= 1) return;
    stopCycling();
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allImages.length);
    }, 1500);
  }, [allImages.length, stopCycling]);

  useEffect(() => stopCycling, [stopCycling]);

  const handleMouseEnter = () => {
    onHoverStart?.();
    startCycling();
  };

  const handleMouseLeave = () => {
    stopCycling();
    setActiveIndex(0);
    onHoverEnd?.();
  };

  if (allImages.length === 0) return null;

  // For single image, just render it normally
  if (allImages.length === 1) {
    return (
      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
        <img src={allImages[0]} alt={alt} style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }} />
      </div>
    );
  }

  // Fanned images — each tilted at a different angle
  const ROTATIONS = [0, 15, -5, 10, -12];
  const visibleCount = Math.min(allImages.length, ROTATIONS.length);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        height: 320,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {allImages.slice(0, visibleCount).map((src, i) => {
        const isActive = i === activeIndex;
        // Active card: no rotation, front and center
        // Others: fanned out at their assigned angle
        const rotation = isActive ? 0 : ROTATIONS[i];
        const translateX = isActive ? 0 : (ROTATIONS[i] * 1.5);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "85%",
              height: 260,
              borderRadius: 16,
              overflow: "hidden",
              border: isActive ? "2px solid rgba(0,180,216,0.5)" : "1px solid rgba(255,255,255,0.15)",
              transform: `rotate(${rotation}deg) translateX(${translateX}px) scale(${isActive ? 1 : 0.92})`,
              opacity: isActive ? 1 : 0.7,
              zIndex: isActive ? visibleCount + 1 : visibleCount - i,
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isActive
                ? "0 12px 40px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.25)",
              transformOrigin: "center bottom",
            }}
          >
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        );
      })}
      {/* Image counter dots */}
      <div style={{
        position: "absolute",
        bottom: 4,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: visibleCount + 2,
        display: "flex",
        gap: 5,
        background: "rgba(0,0,0,0.4)",
        borderRadius: 12,
        padding: "4px 10px",
        backdropFilter: "blur(4px)",
      }}>
        {allImages.slice(0, visibleCount).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: i === activeIndex ? "#00B4D8" : "rgba(255,255,255,0.5)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MainHeroSlide() {
  return (
    <div>
      <section style={{ background: SLIDE_BG, padding: "clamp(40px, 8vw, 72px) 24px", position: "relative", overflow: "hidden" }}>
        <div style={slideGlow} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={14}>
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
                  marginBottom: 24,
                }}
              >
                #1 Tech Training Institute in Bangalore
              </div>
              <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 20 }}>
                Build Your Tech Career{" "}
                <span style={{ color: "#00B4D8" }}>From Zero to Hero</span>
              </h1>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
                Industry-designed courses with guaranteed internships, expert mentorship, and
                placement support. Join 5,000+ students who launched their tech careers with Algonex.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/allcourses">
                  <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ height: 50, fontSize: 16, borderRadius: 8 }}>
                    Explore Courses
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="large" ghost style={{ height: 50, fontSize: 16, borderRadius: 8, color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                    Book Free Demo
                  </Button>
                </Link>
              </div>
            </Col>
            <Col xs={24} lg={10}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {stats.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16,
                      padding: "28px 20px",
                      textAlign: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: 32, fontWeight: 800, color: "white" }}>{s.value}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

function CourseSlide({ course, onHoverStart, onHoverEnd }) {
  const c = course || FALLBACK_COURSE;
  return (
    <div>
      <section style={{ background: SLIDE_BG, padding: "clamp(40px, 8vw, 72px) 24px", position: "relative", overflow: "hidden" }}>
        <div style={slideGlow} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} lg={14}>
              <Tag color="cyan" style={{ marginBottom: 16, fontSize: 13 }}>
                <StarOutlined /> Trending Course
              </Tag>
              <h1 style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
                {c.name}
              </h1>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>
                {(c.description || "").substring(0, 180)}{c.description?.length > 180 ? "..." : ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 24 }}>
                <span><ClockCircleOutlined /> {c.duration || c.Duration}</span>
                {c.price && <span><DollarOutlined /> {"\u20b9"}{Number(c.price).toLocaleString("en-IN")}{c.discount ? ` (${c.discount} off)` : ""}</span>}
                {c.rating && <span><StarOutlined /> {c.rating}/5 ({c.reviews} reviews)</span>}
                {c.students && <span><TeamOutlined /> {c.students?.toLocaleString()} students</span>}
              </div>
              {c.skills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                  {c.skills.slice(0, 6).map((s) => (
                    <Tag key={s} style={{ background: "rgba(0,180,216,0.15)", border: "1px solid rgba(0,180,216,0.3)", color: "#66E5FF" }}>{s}</Tag>
                  ))}
                  {c.skills.length > 6 && <Tag style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>+{c.skills.length - 6} more</Tag>}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={c.slug ? `/courses/${c.slug}` : `/stack/${c.id}`}>
                  <Button type="primary" size="large" style={{ height: 50, fontSize: 16, borderRadius: 8 }}>
                    View Course <ArrowRightOutlined />
                  </Button>
                </Link>
                <Link to="/allcourses">
                  <Button size="large" ghost style={{ height: 50, fontSize: 16, borderRadius: 8, color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                    All Courses
                  </Button>
                </Link>
              </div>
            </Col>
            <Col xs={24} lg={10}>
              <StackedImageGallery
                images={c.media || []}
                primaryImage={c.image}
                alt={c.name}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
              />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

function EventSlide({ event, onHoverStart, onHoverEnd }) {
  const e = event || FALLBACK_EVENT;
  const startDate = e.start_date ? new Date(e.start_date) : null;
  const spotsLeft = e.spots_left ?? (e.capacity - (e.registered || 0));
  return (
    <div>
      <section style={{ background: SLIDE_BG, padding: "clamp(40px, 8vw, 72px) 24px", position: "relative", overflow: "hidden" }}>
        <div style={slideGlow} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} lg={14}>
              <Tag color="magenta" style={{ marginBottom: 16, fontSize: 13 }}>
                <CalendarOutlined /> Upcoming Event
              </Tag>
              <h1 style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
                {e.title}
              </h1>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>
                {e.summary || (e.description || "").substring(0, 180)}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 24 }}>
                {startDate && (
                  <span><CalendarOutlined /> {startDate.toLocaleDateString("en-IN", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</span>
                )}
                <span><EnvironmentOutlined /> {e.location}</span>
                {e.event_type && <span><CodeOutlined /> {e.event_type}</span>}
                {e.capacity && (
                  <span><TeamOutlined /> {spotsLeft != null ? `${spotsLeft} spots left` : `${e.capacity} capacity`}</span>
                )}
              </div>
              {spotsLeft != null && spotsLeft > 0 && spotsLeft <= 10 && (
                <Tag color="orange" style={{ marginBottom: 24, fontSize: 13, padding: "4px 12px" }}>
                  Only {spotsLeft} spots remaining — register soon!
                </Tag>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={e.slug ? `/events/${e.slug}` : "/events"}>
                  <Button type="primary" size="large" style={{ height: 50, fontSize: 16, borderRadius: 8 }}>
                    {e.slug ? "Register Now" : "View Events"} <ArrowRightOutlined />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="large" ghost style={{ height: 50, fontSize: 16, borderRadius: 8, color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                    All Events
                  </Button>
                </Link>
              </div>
            </Col>
            <Col xs={24} lg={10}>
              <StackedImageGallery
                images={e.media || []}
                primaryImage={e.image}
                alt={e.title}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
              />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

function ProgramSlide({ program, onHoverStart, onHoverEnd }) {
  const p = program || FALLBACK_PROGRAM;
  const deadline = p.application_deadline ? new Date(p.application_deadline) : null;
  return (
    <div>
      <section style={{ background: SLIDE_BG, padding: "clamp(40px, 8vw, 72px) 24px", position: "relative", overflow: "hidden" }}>
        <div style={slideGlow} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} lg={14}>
              <Tag color="purple" style={{ marginBottom: 16, fontSize: 13, textTransform: "capitalize" }}>
                <RocketOutlined /> {p.program_type || "Program"}
              </Tag>
              <h1 style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
                {p.title}
              </h1>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>
                {(p.description || "").substring(0, 180)}{p.description?.length > 180 ? "..." : ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 24 }}>
                <span><ClockCircleOutlined /> {p.duration}</span>
                {p.stipend && <span><DollarOutlined /> {p.stipend}</span>}
                <span>
                  {p.is_remote ? <><LaptopOutlined /> Remote</> : <><EnvironmentOutlined /> {p.location}</>}
                </span>
                {deadline && (
                  <span><CalendarOutlined /> Deadline: {deadline.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                )}
                {p.registration_count > 0 && (
                  <span><TeamOutlined /> {p.registration_count} registered</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={p.slug ? `/register?program=${p.slug}` : "/register"}>
                  <Button type="primary" size="large" style={{ height: 50, fontSize: 16, borderRadius: 8 }}>
                    Register Now <ArrowRightOutlined />
                  </Button>
                </Link>
                <Link to={p.slug ? `/programs/${p.slug}` : "/programs"}>
                  <Button size="large" ghost style={{ height: 50, fontSize: 16, borderRadius: 8, color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                    View Details
                  </Button>
                </Link>
              </div>
            </Col>
            <Col xs={24} lg={10}>
              <StackedImageGallery
                images={p.media || []}
                primaryImage={p.image}
                alt={p.title}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
              />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

// Arrow components for carousel navigation
const ArrowButton = ({ direction, onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      [direction === "left" ? "left" : "right"]: 16,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "white",
      fontSize: 16,
      backdropFilter: "blur(4px)",
      transition: "background 0.2s",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
  >
    {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
  </div>
);

export default function Home() {
  const trendingCourses = STACKS.filter((c) => c.isTrending).slice(0, 4);
  const carouselRef = useRef(null);

  const pauseCarousel = useCallback(() => {
    carouselRef.current?.innerSlider?.pause?.("paused");
  }, []);

  const resumeCarousel = useCallback(() => {
    carouselRef.current?.innerSlider?.autoPlay?.("play");
  }, []);

  const [heroData, setHeroData] = useState({
    course: FALLBACK_COURSE,
    event: FALLBACK_EVENT,
    program: FALLBACK_PROGRAM,
  });

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    commonAPI.getGallery()
      .then((res) => {
        const results = res.data?.data || res.data || [];
        setGalleryImages(results);
      })
      .catch(() => {});
    // Fetch top items for each slide — fire all in parallel, fall back silently
    coursesAPI.list()
      .then((res) => {
        const results = res.data?.data?.results || res.data?.results || [];
        const trending = results.find((c) => c.is_trending) || results[0];
        if (trending) setHeroData((prev) => ({ ...prev, course: trending }));
      })
      .catch(() => {});

    eventsAPI.list()
      .then((res) => {
        const results = res.data?.data?.results || res.data?.results || [];
        // Pick the nearest upcoming event (first in list, assuming ordered by start_date)
        if (results.length > 0) setHeroData((prev) => ({ ...prev, event: results[0] }));
      })
      .catch(() => {});

    programsAPI.list()
      .then((res) => {
        const results = res.data?.data?.results || res.data?.results || [];
        // Pick featured or first accepting program
        const featured = results.find((p) => p.is_featured) || results[0];
        if (featured) setHeroData((prev) => ({ ...prev, program: featured }));
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Carousel */}
      <div style={{ position: "relative" }}>
        <Carousel
          ref={carouselRef}
          autoplay
          autoplaySpeed={6000}
          dots={{ className: "hero-carousel-dots" }}
          effect="fade"
        >
          <MainHeroSlide />
          <CourseSlide course={heroData.course} onHoverStart={pauseCarousel} onHoverEnd={resumeCarousel} />
          <EventSlide event={heroData.event} onHoverStart={pauseCarousel} onHoverEnd={resumeCarousel} />
          <ProgramSlide program={heroData.program} onHoverStart={pauseCarousel} onHoverEnd={resumeCarousel} />
        </Carousel>
        <ArrowButton direction="left" onClick={() => carouselRef.current?.prev()} />
        <ArrowButton direction="right" onClick={() => carouselRef.current?.next()} />
      </div>

      {/* Outcomes Ticker */}
      <OutcomesTicker />

      {/* Trending Courses */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "#2c3e50", marginBottom: 4 }}>
                Trending Courses
              </h2>
              <p style={{ color: "#666" }}>Programs our students love the most</p>
            </div>
            <Link to="/allcourses">
              <Button type="link" size="large">
                View All Courses <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
          <Row gutter={[24, 24]}>
            {trendingCourses.map((course) => (
              <Col key={course.id} xs={24} sm={12} lg={6}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Explore Learning Paths (WebGL Circular Gallery) */}
      <section style={{ background: "#0f172a", padding: "48px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", marginBottom: 32 }}>
          <Tag color="cyan" style={{ marginBottom: 12, padding: "2px 12px", borderRadius: 16, textTransform: "uppercase", fontSize: 12, fontWeight: 600 }}>
            Interactive Showcase
          </Tag>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>
            Explore Our Learning Paths
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>
            Drag left/right or scroll to navigate through our top career-building paths
          </p>
        </div>
        <div style={{ height: "380px", position: "relative", width: "100%" }}>
          <CircularGallery
            items={
              galleryImages.length > 0
                ? galleryImages.map((img) => ({ image: img.image, text: img.title || "Gallery Image" }))
                : GALLERY_ITEMS
            }
            bend={3}
            textColor="#00B4D8"
            borderRadius={0.05}
            scrollEase={0.02}
            fontUrl="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
            font="bold 24px Orbitron"
          />
        </div>
      </section>

      {/* Projects Showcase (NEW) */}
      <ProjectsSection />

      {/* Why Algonex */}
      <section style={{ padding: "64px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#2c3e50", marginBottom: 8 }}>
              Why Algonex?
            </h2>
            <p style={{ color: "#666", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
              We don't just teach technology — we build careers
            </p>
          </div>
          <Row gutter={[24, 24]}>
            {features.map((f, i) => (
              <Col key={i} xs={24} sm={12} lg={8}>
                <div
                  style={{
                    padding: 28,
                    borderRadius: 16,
                    border: "1px solid #e8e8e8",
                    height: "100%",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#00B4D8";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,180,216,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e8e8e8";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#2c3e50", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: "#666", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Student Reviews (NEW) */}
      <ReviewsSection />

      {/* Algonex Gallery (NEW) */}
      <GallerySection />

      {/* FAQ Section (NEW) */}
      <FAQSection />

      {/* Quiz CTA */}
      <section style={{ padding: "64px 24px", background: "#EBFBFF" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#2c3e50", marginBottom: 12 }}>
            Not sure which course is right for you?
          </h2>
          <p style={{ color: "#666", fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            Take our 60-second quiz and get a personalized recommendation based on your background,
            interests, and career goals.
          </p>
          <Link to="/quiz">
            <Button type="primary" size="large" style={{ height: 50, fontSize: 16, borderRadius: 8 }}>
              Find Your Perfect Course <ArrowRightOutlined />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #00B4D8, #0891b2)", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "white", marginBottom: 12 }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            Join thousands of students who transformed their careers. First consultation is free.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register">
              <Button size="large" style={{ height: 48, fontSize: 16, borderRadius: 8, background: "white", color: "#00B4D8", fontWeight: 600, border: "none" }}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="large" ghost style={{ height: 48, fontSize: 16, borderRadius: 8, color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
