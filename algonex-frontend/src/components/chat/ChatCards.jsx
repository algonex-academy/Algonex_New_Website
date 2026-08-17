import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Star,
  Users,
  MapPin,
  Calendar,
  Briefcase,
  Zap,
  ExternalLink,
  ChevronRight,
  Award,
  TrendingUp,
} from "lucide-react";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const levelColor = {
  beginner: "var(--buddy-green)",
  intermediate: "var(--buddy-amber)",
  advanced: "var(--buddy-red)",
};

const jobTypeLabel = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
  contract: "Contract",
};

const eventTypeColor = {
  workshop: "#6366f1",
  webinar: "#06b6d4",
  hackathon: "#f59e0b",
  meetup: "#10b981",
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
};

// ─── Course Card ──────────────────────────────────────────────────────────────

export function CourseCardInChat({ data }) {
  const discountedPrice =
    data.discount > 0
      ? (parseFloat(data.price) * (1 - data.discount / 100)).toFixed(0)
      : null;

  return (
    <motion.div className="buddy-card" variants={cardVariants} initial="hidden" animate="visible">
      {/* Header strip */}
      <div className="buddy-card-header" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}>
        {data.is_trending && (
          <span className="buddy-badge" style={{ background: "#f59e0b", color: "#1c1917" }}>
            <TrendingUp size={10} style={{ marginRight: 4 }} />
            Trending
          </span>
        )}
        <span
          className="buddy-badge"
          style={{ background: levelColor[data.level] || "#6366f1", color: "#fff", textTransform: "capitalize" }}
        >
          {data.level}
        </span>
      </div>

      <div className="buddy-card-body">
        <p className="buddy-card-title">{data.name}</p>
        <p className="buddy-card-desc">{data.description}</p>

        <div className="buddy-card-meta">
          <span><Clock size={12} /> {data.duration}</span>
          {data.average_rating && (
            <span><Star size={12} style={{ color: "#f59e0b" }} /> {data.average_rating}</span>
          )}
          {data.student_count > 0 && (
            <span><Users size={12} /> {data.student_count} enrolled</span>
          )}
        </div>

        {data.skills?.length > 0 && (
          <div className="buddy-tag-row">
            {data.skills.slice(0, 4).map((s) => (
              <span key={s} className="buddy-tag">{s}</span>
            ))}
          </div>
        )}
      </div>

      <div className="buddy-card-footer">
        <div className="buddy-price">
          {discountedPrice ? (
            <>
              <span className="buddy-price-main">₹{discountedPrice}</span>
              <span className="buddy-price-orig">₹{parseFloat(data.price).toFixed(0)}</span>
              <span className="buddy-badge" style={{ background: "var(--buddy-green)", color: "#fff", fontSize: 10 }}>
                {data.discount}% OFF
              </span>
            </>
          ) : (
            <span className="buddy-price-main">₹{parseFloat(data.price).toFixed(0)}</span>
          )}
        </div>
        <Link to={`/courses/${data.slug}`} className="buddy-cta-btn">
          View Course <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

export function EventCardInChat({ data }) {
  const start = new Date(data.start_date);
  const dateStr = start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const accentColor = eventTypeColor[data.event_type] || "#6366f1";

  return (
    <motion.div className="buddy-card" variants={cardVariants} initial="hidden" animate="visible">
      <div className="buddy-card-header" style={{ background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`, borderBottom: `2px solid ${accentColor}` }}>
        <span className="buddy-badge" style={{ background: accentColor, color: "#fff", textTransform: "capitalize" }}>
          {data.event_type}
        </span>
        <span
          className="buddy-badge"
          style={{
            background: data.status === "upcoming" ? "var(--buddy-green)" : data.status === "ongoing" ? "#f59e0b" : "#6b7280",
            color: "#fff",
          }}
        >
          {data.status}
        </span>
      </div>

      <div className="buddy-card-body">
        <p className="buddy-card-title">{data.title}</p>
        {data.summary && <p className="buddy-card-desc">{data.summary}</p>}

        <div className="buddy-card-meta">
          <span><Calendar size={12} /> {dateStr} · {timeStr}</span>
          <span><MapPin size={12} /> {data.location}</span>
        </div>

        {data.is_full ? (
          <span className="buddy-badge" style={{ background: "#ef4444", color: "#fff" }}>Fully Booked</span>
        ) : (
          <span className="buddy-badge" style={{ background: "var(--buddy-green)", color: "#fff" }}>
            {data.spots_left} spots left
          </span>
        )}
      </div>

      <div className="buddy-card-footer" style={{ justifyContent: "flex-end" }}>
        <Link to={`/events/${data.slug}`} className="buddy-cta-btn" style={{ background: accentColor }}>
          Register Now <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

export function JobCardInChat({ data }) {
  const salary =
    data.salary_min && data.salary_max
      ? `₹${parseInt(data.salary_min).toLocaleString()} – ₹${parseInt(data.salary_max).toLocaleString()}`
      : data.salary_min
      ? `From ₹${parseInt(data.salary_min).toLocaleString()}`
      : null;

  const isInternship = data.job_type === "internship";

  return (
    <motion.div className="buddy-card" variants={cardVariants} initial="hidden" animate="visible">
      <div
        className="buddy-card-header"
        style={{ background: isInternship ? "linear-gradient(135deg, #064e3b, #065f46)" : "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}
      >
        <span className="buddy-badge" style={{ background: isInternship ? "#10b981" : "#3b82f6", color: "#fff" }}>
          {jobTypeLabel[data.job_type] || data.job_type}
        </span>
        {data.is_remote && (
          <span className="buddy-badge" style={{ background: "#7c3aed", color: "#fff" }}>Remote</span>
        )}
      </div>

      <div className="buddy-card-body">
        <p className="buddy-card-title">{data.title}</p>
        <p style={{ fontSize: 12, color: "var(--buddy-muted)", marginBottom: 8 }}>
          {data.company_name} · <span style={{ textTransform: "capitalize" }}>{data.department}</span>
        </p>

        <div className="buddy-card-meta">
          <span><MapPin size={12} /> {data.location}</span>
          {salary && <span><Briefcase size={12} /> {salary}/yr</span>}
          {data.deadline && (
            <span><Calendar size={12} /> Apply by {new Date(data.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          )}
        </div>

        {data.tags?.length > 0 && (
          <div className="buddy-tag-row">
            {data.tags.slice(0, 4).map((t) => (
              <span key={t} className="buddy-tag">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="buddy-card-footer" style={{ justifyContent: "flex-end" }}>
        {data.apply_mode === "external" && data.external_link ? (
          <a href={data.external_link} target="_blank" rel="noopener noreferrer" className="buddy-cta-btn">
            Apply Now <ExternalLink size={13} />
          </a>
        ) : (
          <Link to={`/careers/${data.slug}`} className="buddy-cta-btn">
            Apply Now <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// ─── Program Card ─────────────────────────────────────────────────────────────

export function ProgramCardInChat({ data }) {
  const deadline = new Date(data.application_deadline);
  const deadlineStr = deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const isFellowship = data.program_type === "fellowship";

  return (
    <motion.div className="buddy-card" variants={cardVariants} initial="hidden" animate="visible">
      <div
        className="buddy-card-header"
        style={{
          background: isFellowship
            ? "linear-gradient(135deg, #4c1d95, #6d28d9)"
            : "linear-gradient(135deg, #1e3a5f, #0369a1)",
        }}
      >
        <span className="buddy-badge" style={{ background: isFellowship ? "#a78bfa" : "#38bdf8", color: "#1e1b4b" }}>
          <Award size={10} style={{ marginRight: 4 }} />
          {isFellowship ? "Fellowship" : "Internship"}
        </span>
        {data.is_featured && (
          <span className="buddy-badge" style={{ background: "#f59e0b", color: "#1c1917" }}>Featured</span>
        )}
      </div>

      <div className="buddy-card-body">
        <p className="buddy-card-title">{data.title}</p>
        <p className="buddy-card-desc">{data.description}</p>

        <div className="buddy-card-meta">
          <span><Clock size={12} /> {data.duration}</span>
          {data.stipend && <span><Zap size={12} style={{ color: "#f59e0b" }} /> {data.stipend}</span>}
          <span><MapPin size={12} /> {data.is_remote ? "Remote" : data.location}</span>
        </div>

        <div style={{ marginTop: 8 }}>
          {data.is_accepting ? (
            <span className="buddy-badge" style={{ background: "var(--buddy-green)", color: "#fff" }}>
              {data.spots_left} spots · {deadlineStr} deadline
            </span>
          ) : (
            <span className="buddy-badge" style={{ background: "#ef4444", color: "#fff" }}>Applications Closed</span>
          )}
        </div>
      </div>

      <div className="buddy-card-footer" style={{ justifyContent: "flex-end" }}>
        <Link to={`/programs/${data.slug}`} className="buddy-cta-btn" style={{ background: isFellowship ? "#7c3aed" : "#0284c7" }}>
          View Program <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── FAQ Block ────────────────────────────────────────────────────────────────

export function FAQBlockInChat({ data }) {
  return (
    <motion.div
      className="buddy-card"
      style={{ padding: 0, overflow: "hidden" }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="buddy-card-header" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
        <span className="buddy-card-title" style={{ margin: 0, fontSize: 13 }}>📖 FAQs — {data.course}</span>
      </div>
      <div style={{ padding: "8px 12px" }}>
        {data.faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <p style={{ fontWeight: 600, fontSize: 12, color: "var(--buddy-text)", margin: "4px 0 2px" }}>
              Q: {faq.question}
            </p>
            <p style={{ fontSize: 12, color: "var(--buddy-muted)", margin: 0, lineHeight: 1.5 }}>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Card Renderer (central dispatcher) ──────────────────────────────────────

export function CardRenderer({ cards }) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="buddy-cards-grid">
      {cards.map((card, i) => {
        if (card.type === "course") return <CourseCardInChat key={i} data={card} />;
        if (card.type === "event") return <EventCardInChat key={i} data={card} />;
        if (card.type === "job") return <JobCardInChat key={i} data={card} />;
        if (card.type === "program") return <ProgramCardInChat key={i} data={card} />;
        if (card.type === "faq_block") return <FAQBlockInChat key={i} data={card} />;
        return null;
      })}
    </div>
  );
}
