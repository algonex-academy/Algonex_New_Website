import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Button, Empty, Spin, Modal, App, Row, Col } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { eventsAPI } from "../../api/events";
import { useAuth } from "../../hooks/useAuth";

const TYPE_COLORS = { workshop: "cyan", webinar: "blue", hackathon: "magenta", meetup: "green" };

export default function EventDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { message } = App.useApp();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regStatus, setRegStatus] = useState(null); // "confirmed" | "waitlisted" | null
  const [actionLoading, setActionLoading] = useState(false);

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
      navigate("/signin", { state: { from: { pathname: `/events/${slug}` } } });
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
    </div>
  );
}
