import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Dropdown, Button, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import algonexLogo from '../Public/algonex_logo.png';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/campus-crew', label: 'Campus Crew' },
  { to: '/allcourses', label: 'Courses' },
  { to: '/programs', label: 'Programs' },
  { to: '/careers', label: 'Careers' },
  { to: '/aboutus', label: 'About' },
  { to: '/alumni', label: 'Alumni' },
  { to: '/contact', label: 'Contact' },
];


const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const dropdownItems = {
    items: [
      { key: 'profile', label: <Link to="/profile">Profile</Link> },
      { key: 'my-courses', label: <Link to="/my-courses">My Courses</Link> },
      { key: 'my-events', label: <Link to="/my-events">My Events</Link> },
      { key: 'my-applications', label: <Link to="/my-applications">My Applications</Link> },
      ...(user?.role === 'admin' || user?.is_staff
        ? [
            { type: 'divider' },
            { key: 'admin-backups', label: <Link to="/dashboard/backups" style={{ fontWeight: 600, color: '#0284c7' }}>☁️ S3 Backups & Restore</Link> },
            { key: 'django-admin', label: <a href="/admin/" target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: '#4f46e5' }}>⚙️ Django Admin</a> },
          ]
        : []),
      { type: 'divider' },
      { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
    ],
  };

  const coursesDropdownItems = {
    items: [
      { key: 'training', label: <Link to="/training" style={{ padding: '4px 8px', display: 'block', fontSize: 13, color: '#333' }}>Training</Link> },
      { key: 'internship', label: <Link to="/internship" style={{ padding: '4px 8px', display: 'block', fontSize: 13, color: '#333' }}>Internship</Link> },
      { key: 'fellowship', label: <Link to="/fellowship" style={{ padding: '4px 8px', display: 'block', fontSize: 13, color: '#333' }}>Fellowship</Link> },
      { key: 'certificate', label: <Link to="/certificate" style={{ padding: '4px 8px', display: 'block', fontSize: 13, color: '#333' }}>Certificate</Link> },
      { type: 'divider' },
      { key: 'all-courses', label: <Link to="/allcourses" style={{ padding: '4px 8px', display: 'block', fontSize: 13, color: '#00B4D8', fontWeight: 600 }}>All Courses</Link> },
    ],
  };

  const drawerLinkStyle = (path) => ({
    padding: '14px 24px',
    color: isActive(path) ? '#00B4D8' : '#333',
    textDecoration: 'none',
    fontWeight: isActive(path) ? 600 : 500,
    fontSize: 16,
    borderBottom: '1px solid #f5f5f5',
    background: isActive(path) ? '#f0fbff' : 'transparent',
    display: 'block',
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    }}>
      <nav style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img
            src={algonexLogo}
            alt="Algonex"
            style={{ height: 40 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.05', justifyContent: 'center' }}>
            <span style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              ALGONEX
            </span>
            <span style={{
              fontSize: 19,
              fontWeight: 600,
              color: '#000000',
              letterSpacing: '0.3px',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              IT Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul style={{
          display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0,
        }} className="desktop-nav">
          {navLinks.map((link) => {
            if (link.label === 'Courses') {
              const isCoursesActive = isActive('/training') || isActive('/internship') || isActive('/fellowship') || isActive('/certificate') || isActive('/allcourses');
              return (
                <li key={link.to}>
                  <Dropdown menu={coursesDropdownItems} placement="bottomLeft" arrow>
                    <span
                      style={{
                        color: isCoursesActive ? '#00B4D8' : '#555',
                        textDecoration: 'none',
                        fontWeight: isCoursesActive ? 600 : 500,
                        fontSize: 14,
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: isCoursesActive ? 'rgba(0,180,216,0.08)' : 'transparent',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {link.label}
                      <span style={{ fontSize: 10, color: isCoursesActive ? '#00B4D8' : '#999' }}>▼</span>
                    </span>
                  </Dropdown>
                </li>
              );
            }
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  style={{
                    color: isActive(link.to) ? '#00B4D8' : '#555',
                    textDecoration: 'none',
                    fontWeight: isActive(link.to) ? 600 : 500,
                    fontSize: 14,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: isActive(link.to) ? 'rgba(0,180,216,0.08)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li style={{ marginLeft: 8 }}>
            {isAuthenticated ? (
              <Dropdown menu={dropdownItems} placement="bottomRight">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '4px 12px 4px 4px', borderRadius: 24,
                  border: '1px solid #e8e8e8', transition: 'all 0.2s',
                }}>
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    src={user?.avatar}
                    style={{ backgroundColor: '#00B4D8' }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#333', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.first_name || 'Account'}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/signin">
                  <Button style={{ borderRadius: 8 }}>Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary" style={{ borderRadius: 8 }}>Register</Button>
                </Link>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <div className="mobile-nav-trigger">
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
            style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
        </div>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <Link to="/" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <img
                src={algonexLogo}
                alt="Algonex"
                style={{ height: 34 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.05', justifyContent: 'center' }}>
                <span style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#000000',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                  ALGONEX
                </span>
                <span style={{
                  fontSize: 19,
                  fontWeight: 600,
                  color: '#000000',
                  letterSpacing: '0.2px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                  IT Solutions
                </span>
              </div>
            </Link>
          }
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={300}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {navLinks.map((link) => {
              if (link.label === 'Courses') {
                const isCoursesActive = isActive('/training') || isActive('/internship') || isActive('/fellowship') || isActive('/certificate') || isActive('/allcourses');
                return (
                  <div key={link.to} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <div
                      onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                      style={{
                        padding: '14px 24px',
                        color: isCoursesActive ? '#00B4D8' : '#333',
                        fontWeight: isCoursesActive ? 600 : 500,
                        fontSize: 16,
                        background: isCoursesActive ? '#f0fbff' : 'transparent',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <span>Courses</span>
                      <span style={{ fontSize: 12, transform: mobileCoursesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: isCoursesActive ? '#00B4D8' : '#999' }}>▼</span>
                    </div>
                    {mobileCoursesOpen && (
                      <div style={{ background: '#fcfcfc', borderTop: '1px solid #f5f5f5' }}>
                        <Link to="/training" onClick={() => setDrawerOpen(false)} style={{ ...drawerLinkStyle('/training'), paddingLeft: 40, borderBottom: '1px solid #f9f9f9', fontSize: 15 }}>
                          Training
                        </Link>
                        <Link to="/internship" onClick={() => setDrawerOpen(false)} style={{ ...drawerLinkStyle('/internship'), paddingLeft: 40, borderBottom: '1px solid #f9f9f9', fontSize: 15 }}>
                          Internship
                        </Link>
                        <Link to="/fellowship" onClick={() => setDrawerOpen(false)} style={{ ...drawerLinkStyle('/fellowship'), paddingLeft: 40, borderBottom: '1px solid #f9f9f9', fontSize: 15 }}>
                          Fellowship
                        </Link>
                        <Link to="/certificate" onClick={() => setDrawerOpen(false)} style={{ ...drawerLinkStyle('/certificate'), paddingLeft: 40, borderBottom: '1px solid #f9f9f9', fontSize: 15 }}>
                          Certificate
                        </Link>
                        <Link to="/allcourses" onClick={() => setDrawerOpen(false)} style={{ ...drawerLinkStyle('/allcourses'), paddingLeft: 40, borderBottom: 'none', fontSize: 15, color: '#00B4D8' }}>
                          All Courses
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link key={link.to} to={link.to} onClick={() => setDrawerOpen(false)} style={drawerLinkStyle(link.to)}>
                  {link.label}
                </Link>
              );
            })}

            <div style={{ height: 1, background: '#e8e8e8', margin: '8px 0' }} />

            {isAuthenticated ? (
              <>
                <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar size={36} icon={<UserOutlined />} src={user?.avatar} style={{ backgroundColor: '#00B4D8' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.first_name} {user?.last_name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{user?.email}</div>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setDrawerOpen(false)} style={drawerLinkStyle('/profile')}>Profile</Link>
                <Link to="/my-courses" onClick={() => setDrawerOpen(false)} style={drawerLinkStyle('/my-courses')}>My Courses</Link>
                <Link to="/my-events" onClick={() => setDrawerOpen(false)} style={drawerLinkStyle('/my-events')}>My Events</Link>
                <Link to="/my-applications" onClick={() => setDrawerOpen(false)} style={drawerLinkStyle('/my-applications')}>My Applications</Link>
                <div style={{ padding: '14px 24px' }}>
                  <Button danger block onClick={handleLogout} icon={<LogoutOutlined />}>Logout</Button>
                </div>
              </>
            ) : (
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to="/signin" onClick={() => setDrawerOpen(false)}>
                  <Button block size="large" style={{ borderRadius: 8 }}>Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setDrawerOpen(false)}>
                  <Button type="primary" block size="large" style={{ borderRadius: 8 }}>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </Drawer>
      </nav>
    </header>
  );
};

export default Navbar;
