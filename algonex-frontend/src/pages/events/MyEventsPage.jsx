import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Tag, Button, Empty, Spin, Row, Col, App } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { eventsAPI } from "../../api/events";

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message } = App.useApp();

  const fetch = () => {
    setLoading(true);
    eventsAPI.myRegistrations()
      .then((res) => setRegistrations(res.data?.data?.results || res.data?.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCancel = async (slug) => {
    try {
      await eventsAPI.cancel(slug);
      message.success("Registration cancelled.");
      fetch();
    } catch (err) {
      message.error(err.response?.data?.error?.message || "Failed to cancel.");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Events</h1>
      {loading ? (
        <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>
      ) : registrations.length > 0 ? (
        <Row gutter={[24, 24]}>
          {registrations.map((r) => (
            <Col key={r.id} xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12 }}>
                <Tag color={r.status === "confirmed" ? "green" : r.status === "waitlisted" ? "orange" : "default"}>
                  {r.status}
                </Tag>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>{r.event_title}</h3>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                  {r.event_start_date && <div><CalendarOutlined /> {new Date(r.event_start_date).toLocaleDateString()}</div>}
                  {r.event_location && <div><EnvironmentOutlined /> {r.event_location}</div>}
                </div>
                {r.status !== "cancelled" && r.event_slug && (
                  <Button size="small" danger onClick={() => handleCancel(r.event_slug)} style={{ marginTop: 12 }}>
                    Cancel Registration
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="You haven't registered for any events yet.">
          <Link to="/events"><Button type="primary">Browse Events</Button></Link>
        </Empty>
      )}
    </div>
  );
}
