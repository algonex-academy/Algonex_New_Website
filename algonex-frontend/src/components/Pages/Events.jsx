import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Tag, Button, Input, Segmented, Row, Col, Empty, Modal, App, Spin, Carousel } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { eventsAPI } from "../../api/events";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const upcomingEvents = [
  {
    id: 1,
    title: "Full Stack Web Development Workshop",
    date: "April 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Algonex Campus, Bangalore",
    type: "Workshop",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop"
    ],
    spots: 30,
    registered: 22,
    description: "Hands-on workshop covering React, Node.js, and MongoDB with real-world projects.",
  },
  {
    id: 2,
    title: "AI & Machine Learning Masterclass",
    date: "April 22, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Online (Zoom)",
    type: "Webinar",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&auto=format&fit=crop"
    ],
    spots: 100,
    registered: 78,
    description: "Deep dive into neural networks, NLP, and computer vision with industry expert.",
  },
  {
    id: 3,
    title: "Hackathon: Build for Impact",
    date: "May 3-4, 2026",
    time: "9:00 AM - 9:00 PM",
    location: "Algonex Campus, Bangalore",
    type: "Hackathon",
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop"
    ],
    spots: 50,
    registered: 45,
    description: "48-hour hackathon to build solutions for real social challenges. ₹1L prize pool.",
  },
  {
    id: 4,
    title: "Cloud Computing & DevOps Bootcamp",
    date: "May 10, 2026",
    time: "10:00 AM - 3:00 PM",
    location: "Algonex Campus, Bangalore",
    type: "Workshop",
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop"
    ],
    spots: 40,
    registered: 15,
    description: "AWS, Docker, Kubernetes — from setup to deployment in a single day.",
  },
];


const pastEvents = [
  {
    id: 101,
    title: "Python Data Science Workshop",
    date: "March 20, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Algonex Bangalore & Live Stream",
    attendees: 85,
    type: "Workshop",
    speaker: "Dr. Ananya Sharma (Lead Data Scientist at TechCorp)",
    description: "An intensive single-day bootcamp covering NumPy, Pandas, Data Cleaning, Seaborn Visualization, and Scikit-Learn Predictive Modeling. Participants built end-to-end data pipelines.",
    highlights: ["85 live student builders", "Built 3 real-world predictive models", "Interactive Q&A & Certificate distribution"],
    images: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop"
    ]
  },
  {
    id: 102,
    title: "Open Source Contribution Day",
    date: "March 8, 2026",
    time: "11:00 AM - 5:00 PM",
    location: "Algonex Open Source Hub",
    attendees: 120,
    type: "Meetup",
    speaker: "Vikram R (Core Contributor & Open Source Advocate)",
    description: "A collaborative hack-day focused on helping students make their first pull requests to top developer tools and open-source frameworks.",
    highlights: ["120 participants", "45 successful PRs merged", "Mentorship from core maintainers"],
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop"
    ]
  },
  {
    id: 103,
    title: "System Design Interview Prep",
    date: "Feb 25, 2026",
    time: "6:00 PM - 8:30 PM",
    location: "Online Masterclass",
    attendees: 64,
    type: "Webinar",
    speaker: "Rahul Verma (Staff Architect at Enterprise Cloud)",
    description: "Deep dive into scalable web architectures, load balancing, microservices, caching with Redis, and DB sharding strategies.",
    highlights: ["64 aspiring engineers", "Live architectural breakdown of WhatsApp & Uber", "Mock system design exercise"],
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop"
    ]
  },
  {
    id: 104,
    title: "React Native Mobile Dev Sprint",
    date: "Feb 15, 2026",
    time: "10:00 AM - 3:00 PM",
    location: "Algonex Lab 2",
    attendees: 42,
    type: "Workshop",
    speaker: "Priya Nair (Mobile Lead at AppScale)",
    description: "Students created cross-platform iOS and Android mobile apps using React Native, Expo, and RESTful APIs.",
    highlights: ["42 mobile developers", "Built a complete delivery tracker app", "Published builds to Expo Go"],
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=600&auto=format&fit=crop"
    ]
  },
  {
    id: 105,
    title: "Tech Career Fair 2026",
    date: "Jan 30, 2026",
    time: "9:30 AM - 6:00 PM",
    location: "Convention Center, Bangalore",
    attendees: 300,
    type: "Meetup",
    speaker: "Panel of Industry Recruiters & Engineering Managers",
    description: "Flagship career networking summit connecting student builders from Algonex Campus Crew with high-growth technology startups and hiring partners.",
    highlights: ["300+ attendees", "15 partner company booths", "Resume reviews & speed networking"],
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop"
    ]
  },
  {
    id: 106,
    title: "Blockchain & Web3 Introduction",
    date: "Jan 18, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Online Masterclass",
    attendees: 55,
    type: "Webinar",
    speaker: "Karthik Mehta (Web3 Developer & Protocol Researcher)",
    description: "Fundamental breakdown of smart contracts, Solidity, Ethereum EVM, and decentralized applications (dApps).",
    highlights: ["55 crypto-curious builders", "Deployed smart contract to testnet", "Distributed workshop NFTs"],
    images: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop"
    ]
  }
];


const EVENT_TYPES = ["All", "Workshop", "Webinar", "Hackathon", "Meetup"];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [modalEvent, setModalEvent] = useState(null);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [apiEvents, setApiEvents] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();

  // Try API, fall back to static data
  useEffect(() => {
    eventsAPI.list()
      .then((res) => {
        const results = res.data?.data?.results || res.data?.results || [];
        if (results.length > 0) setApiEvents(results);
      })
      .catch(() => {})
      .finally(() => setEventsLoading(false));
  }, []);

  const upcomingEventsList = useMemo(() => {
    if (!apiEvents || apiEvents.length === 0) return upcomingEvents;
    const upcoming = apiEvents.filter((e) => e.status !== "past");
    return upcoming.length > 0 ? upcoming : upcomingEvents;
  }, [apiEvents]);

  const pastEventsList = useMemo(() => {
    if (!apiEvents || apiEvents.length === 0) return pastEvents;
    const past = apiEvents.filter((e) => e.status === "past");
    return past.length > 0 ? past : pastEvents;
  }, [apiEvents]);

  const filteredUpcoming = useMemo(() => {
    return upcomingEventsList.filter((e) => {
      const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
      const eventType = e.type || e.event_type || "";
      const matchesType = typeFilter === "All" || eventType.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [upcomingEventsList, search, typeFilter]);  const handleRegister = (event) => {
    if (!isAuthenticated) {
      setShowSigninModal(true);
      return;
    }
    setModalEvent(event);
  };

  const confirmRegister = async () => {
    if (!modalEvent) return;
    const eventSlug = modalEvent.slug || modalEvent.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setRegisterLoading(true);
    try {
      await eventsAPI.register(eventSlug);
      setRegisteredEvents((prev) => new Set([...prev, modalEvent.id]));
      message.success(`Registered for ${modalEvent.title}!`);
      setModalEvent(null);
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || "Registration failed.";
      message.error(errMsg);
      setModalEvent(null);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div>
      {/* Upcoming Events */}
      <section style={{ padding: "48px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#2c3e50", marginBottom: 24 }}>
          Upcoming Events
        </h2>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32, padding: 20, background: "#f8fafc", borderRadius: 12 }}>
          <Input
            placeholder="Search events..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 280, flex: "1 1 200px" }}
            size="large"
            allowClear
          />
          <Segmented options={EVENT_TYPES} value={typeFilter} onChange={setTypeFilter} size="large" />
        </div>

        {filteredUpcoming.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredUpcoming.map((event) => {
              const spotsLeft = event.spots_left ?? (event.spots != null ? event.spots - (event.registered || 0) : null);
              const eventImages = (event.images && event.images.length > 0)
                ? event.images
                : (event.image ? [event.image] : ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop"]);
              const colSpan = (filteredUpcoming.length === 4 || filteredUpcoming.length === 2) ? { xs: 24, sm: 12, md: 12 } : { xs: 24, sm: 12, md: 8 };
              return (
                <Col key={event.id} {...colSpan}>
                  <Card
                    hoverable
                    style={{ borderRadius: 10, border: "1px solid #e8e8e8", height: "100%", display: "flex", flexDirection: "column" }}
                    styles={{ body: { padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column" } }}
                    cover={
                      <div style={{ position: "relative", height: 125, overflow: "hidden", borderRadius: "10px 10px 0 0" }}>
                        <Carousel autoplay autoplaySpeed={2200} effect="scrollx" dots style={{ height: 125 }}>
                          {eventImages.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} style={{ height: 125 }}>
                              <img
                                alt={`${event.title} - ${imgIdx}`}
                                src={imgUrl}
                                style={{ width: "100%", height: 125, objectFit: "cover", display: "block" }}
                              />
                            </div>
                          ))}
                        </Carousel>

                        <Tag
                          color={(event.event_type || event.type) === "hackathon" ? "magenta" : (event.event_type || event.type) === "webinar" ? "blue" : "cyan"}
                          style={{ position: "absolute", top: 6, left: 6, margin: 0, fontSize: 9, fontWeight: 700, padding: "0 4px", lineHeight: "16px", zIndex: 2 }}
                        >
                          {event.event_type || event.type}
                        </Tag>
                        {spotsLeft != null && <Tag
                          color={spotsLeft <= 5 ? "red" : spotsLeft <= 15 ? "orange" : "green"}
                          style={{ position: "absolute", top: 6, right: 6, margin: 0, fontSize: 9, fontWeight: 700, padding: "0 4px", lineHeight: "16px", zIndex: 2 }}
                        >
                          {spotsLeft} spots
                        </Tag>}
                      </div>
                    }
                  >
                    <Link to={event.slug ? `/events/${event.slug}` : "#"} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", color: "#2c3e50" }}>{event.title}</h3>
                    </Link>
                    <p style={{ color: "#64748b", fontSize: 11, marginBottom: 8, lineHeight: 1.35, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {event.summary || (event.description || "").substring(0, 75) + (event.description?.length > 75 ? "..." : "")}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, color: "#888", fontSize: 10, marginBottom: 8 }}>
                      <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><CalendarOutlined style={{ color: "#00B4D8", marginRight: 4 }} /> {event.date || (event.start_date && new Date(event.start_date).toLocaleDateString())} {event.time_range ? `(${event.time_range})` : ""}</div>
                      <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><EnvironmentOutlined style={{ color: "#00B4D8", marginRight: 4 }} /> {event.location}</div>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: "auto" }}>
                      {event.slug && (
                        <Link to={`/events/${event.slug}`} style={{ flex: 1 }}>
                          <Button block size="small" style={{ fontSize: 11, height: 26, padding: "0 4px" }}>Details</Button>
                        </Link>
                      )}
                      <div style={{ flex: 1 }}>
                        {registeredEvents.has(event.id) ? (
                          <Button block size="small" style={{ background: "#22c55e", color: "white", border: "none", fontSize: 11, height: 26, padding: "0 4px" }}>
                            Registered
                          </Button>
                        ) : (
                          <Button type="primary" block size="small" onClick={() => handleRegister(event)} style={{ fontSize: 11, height: 26, padding: "0 4px", background: "#00B4D8", borderColor: "#00B4D8" }}>
                            Register <ArrowRightOutlined style={{ fontSize: 10 }} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Empty description="No events match your search" style={{ padding: 60 }} />
        )}
      </section>

      {/* Past Events */}
      <section style={{ padding: "48px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#2c3e50", marginBottom: 4 }}>
              Past Events & Highlights
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Click any past event card to view session highlights, speaker details, and photo galleries.
            </p>
          </div>
          <Row gutter={[16, 16]}>
            {pastEventsList.map((event) => (
              <Col key={event.id} xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  onClick={() => setPastEventModal(event)}
                  style={{ borderRadius: 12, border: "1px solid #e8e8e8", overflow: "hidden", cursor: "pointer", height: "100%" }}
                  cover={
                    <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
                      <Carousel autoplay autoplaySpeed={3500} dots={false} fade effect="fade">
                        {(event.images && event.images.length > 0 ? event.images : (event.image ? [event.image] : ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop"])).map((imgUrl, idx) => (
                          <div key={idx} style={{ height: 120 }}>
                            <img alt={event.title} src={imgUrl} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                          </div>
                        ))}
                      </Carousel>
                      <Tag color="default" style={{ position: "absolute", top: 8, right: 8, margin: 0, fontWeight: 600, zIndex: 2 }}>
                        {event.event_type || event.type}
                      </Tag>
                    </div>
                  }
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#2c3e50", margin: 0, lineHeight: 1.3 }}>{event.title}</h4>
                  </div>
                  <div style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>
                    <CalendarOutlined style={{ color: "#00B4D8", marginRight: 4 }} /> {event.date || (event.start_date && new Date(event.start_date).toLocaleDateString())}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 8, marginTop: 4 }}>
                    <span style={{ color: "#00B4D8", fontWeight: 600, fontSize: 12 }}>
                      <TeamOutlined style={{ marginRight: 4 }} /> {event.attendees || event.confirmed_count || 0} attended
                    </span>
                    <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600 }}>
                      View Details <InfoCircleOutlined style={{ marginLeft: 2 }} />
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA */}

      <section style={{ background: "linear-gradient(135deg, #00B4D8, #0891b2)", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 12 }}>
          Want to Host an Event with Us?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>
          We partner with companies, colleges, and communities for tech events
        </p>
        <Link to="/contact">
          <Button size="large" style={{ height: 48, borderRadius: 8, background: "white", color: "#00B4D8", fontWeight: 600, border: "none" }}>
            Get in Touch
          </Button>
        </Link>
      </section>

      {/* Past Event Details Modal */}
      <Modal
        open={!!pastEventModal}
        onCancel={() => setPastEventModal(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setPastEventModal(null)} style={{ background: "#00B4D8", borderColor: "#00B4D8", fontWeight: 700 }}>
            Close
          </Button>
        ]}
        width={650}
        destroyOnClose
      >
        {pastEventModal && (
          <div>
            <div style={{ position: "relative", height: 220, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              <Carousel autoplay autoplaySpeed={2500}>
                {(pastEventModal.images || []).map((imgUrl, idx) => (
                  <div key={idx} style={{ height: 220 }}>
                    <img alt={`Gallery ${idx}`} src={imgUrl} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                  </div>
                ))}
              </Carousel>
              <Tag color="cyan" style={{ position: "absolute", top: 12, left: 12, margin: 0, fontWeight: 700, zIndex: 2 }}>
                {pastEventModal.type}
              </Tag>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2c3e50", marginBottom: 8 }}>
              {pastEventModal.title}
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, color: "#64748b", fontSize: 13, marginBottom: 16 }}>
              <span><CalendarOutlined style={{ color: "#00B4D8", marginRight: 4 }} /> {pastEventModal.date} ({pastEventModal.time})</span>
              <span><EnvironmentOutlined style={{ color: "#00B4D8", marginRight: 4 }} /> {pastEventModal.location}</span>
              <span><TeamOutlined style={{ color: "#00B4D8", marginRight: 4 }} /> {pastEventModal.attendees} Participants</span>
            </div>

            {pastEventModal.speaker && (
              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 8, borderLeft: "4px solid #00B4D8", marginBottom: 16, fontSize: 13, color: "#2c3e50", fontWeight: 600 }}>
                Featured Speaker: {pastEventModal.speaker}
              </div>
            )}

            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              {pastEventModal.description}
            </p>

            {pastEventModal.highlights && pastEventModal.highlights.length > 0 && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#2c3e50", marginBottom: 8 }}>
                  Event Highlights & Takeaways:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {pastEventModal.highlights.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155" }}>
                      <CheckCircleOutlined style={{ color: "#22c55e" }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Register Confirmation Modal */}
      <Modal
        title={modalEvent ? `Register for ${modalEvent.title}?` : ""}
        open={!!modalEvent}
        onOk={confirmRegister}
        onCancel={() => setModalEvent(null)}
        okText="Confirm Registration"
        confirmLoading={registerLoading}
      >
        {modalEvent && <p>{modalEvent.date || modalEvent.start_date} | {modalEvent.location}</p>}
      </Modal>

      {/* Sign In Required Modal */}
      <Modal
        title="Sign in required"
        open={showSigninModal}
        onOk={() => {
          setShowSigninModal(false);
          navigate("/signin");
        }}
        onCancel={() => setShowSigninModal(false)}
        okText="Sign In"
      >
        <p>You need to sign in to register for events.</p>
      </Modal>
    </div>
  );
}

