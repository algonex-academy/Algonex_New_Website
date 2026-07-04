import React from "react";
import { Link } from "react-router-dom";
import algonexLogo from "../Public/algonex_logo.png";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkedinOutlined,
  GithubOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/allcourses" },
  { label: "Events", to: "/events" },
  { label: "About Us", to: "/aboutus" },
  { label: "Contact", to: "/contact" },
];

const courseLinks = [
  { label: "Python Full Stack", to: "/courses/python-full-stack" },
  { label: "MERN Stack", to: "/courses/mern-stack" },
  { label: "Data Analytics", to: "/courses/data-analytics" },
  { label: "Python Full Stack", to: "/courses/python-full-stack" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0c1222", color: "rgba(255,255,255,0.7)", padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <img
                src={algonexLogo}
                alt="Algonex"
                style={{ height: 40 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.05', justifyContent: 'center' }}>
                <span style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                  ALGONEX
                </span>
                <span style={{
                  fontSize: 19,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.3px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                  IT Solutions
                </span>
              </div>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              Training institute & software solutions company building the next generation of tech professionals in Bangalore.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="https://www.linkedin.com/company/algonex-it-solutions/" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", transition: "all 0.2s" }}
              >
                <LinkedinOutlined />
              </a>
              <a href="https://github.com/algonex" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)" }}
              >
                <GithubOutlined />
              </a>
              <a href="https://twitter.com/algonex" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)" }}
              >
                <TwitterOutlined />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "white", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 style={{ color: "white", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Popular Courses</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {courseLinks.map((link) => (
                <Link key={link.to} to={link.to} style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "white", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <EnvironmentOutlined style={{ color: "#00B4D8" }} />
                Opposite to KLM, MTK Reddy Building, 2nd floor, Marathahalli Bridge, Bangalore-560037
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PhoneOutlined style={{ color: "#00B4D8" }} />
                +91 9959789424 , +91 8555955279 , +91 7995739967 ,9346630135
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MailOutlined style={{ color: "#00B4D8" }} />
                EMAIL_ADDRESS , solutions@algonex.co.in
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>&copy; {new Date().getFullYear()} Algonex. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link to="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
