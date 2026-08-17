import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TeamOutlined,
  BankOutlined,
  ShopOutlined,
  RobotOutlined,
  CodeOutlined,
  UserSwitchOutlined,
  TrophyOutlined,
  RocketOutlined,
  ApiOutlined
} from '@ant-design/icons';

const NODES = [
  { id: 'students', label: 'Students', desc: 'Active Campus Builders & Leaders', icon: <TeamOutlined />, color: '#00B4D8', angle: 0 },
  { id: 'colleges', label: 'Colleges', desc: 'Campus Ecosystem Partners', icon: <BankOutlined />, color: '#38bdf8', angle: 45 },
  { id: 'industry', label: 'Industry', desc: 'Tech Companies & Hiring Partners', icon: <ShopOutlined />, color: '#34d399', angle: 90 },
  { id: 'ai', label: 'AI & Tech', desc: 'Agentic Workflows & Tools', icon: <RobotOutlined />, color: '#a78bfa', angle: 135 },
  { id: 'projects', label: 'Projects', desc: 'Real-World Production Software', icon: <CodeOutlined />, color: '#f472b6', angle: 180 },
  { id: 'mentors', label: 'Mentors', desc: 'Senior Industry Architects', icon: <UserSwitchOutlined />, color: '#2dd4bf', angle: 225 },
  { id: 'hackathons', label: 'Hackathons', desc: 'Idea to Live Deployed Demos', icon: <TrophyOutlined />, color: '#fbbf24', angle: 270 },
  { id: 'opportunities', label: 'Careers', desc: 'Internship & Career Pathways', icon: <RocketOutlined />, color: '#fb923c', angle: 315 },
];

const InteractiveEcosystem = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef(null);

  // Smooth continuous rotation when not hovered
  const animate = useCallback(() => {
    if (!isHovered) {
      setRotation(prev => (prev + 0.2) % 360);
    }
    animRef.current = requestAnimationFrame(animate);
  }, [isHovered]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  const _activeNodeObj = NODES.find(n => n.id === activeNode);
  const orbitRadiusPct = 36; // % radius from center (50%, 50%)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        margin: '0 auto',
        userSelect: 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveNode(null);
      }}
    >
      {/* Pure Orbit Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          margin: '0 auto',
        }}
      >
        {/* SVG Connection Lines Layer */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Ambient Orbit Guide Rings */}
          <circle cx="50%" cy="50%" r={`${orbitRadiusPct}%`} fill="none" stroke="rgba(0, 180, 216, 0.2)" strokeWidth="1.5" />
          <circle cx="50%" cy="50%" r={`${orbitRadiusPct + 6}%`} fill="none" stroke="rgba(0, 180, 216, 0.08)" strokeWidth="1" strokeDasharray="4 6" />

          {/* Lines from center to each node */}
          {NODES.map((node) => {
            const rad = ((node.angle + rotation) * Math.PI) / 180;
            const xPct = 50 + orbitRadiusPct * Math.cos(rad);
            const yPct = 50 + orbitRadiusPct * Math.sin(rad);
            const isActive = activeNode === node.id;

            return (
              <line
                key={`line-${node.id}`}
                x1="50%"
                y1="50%"
                x2={`${xPct}%`}
                y2={`${yPct}%`}
                stroke={isActive ? node.color : 'rgba(0, 180, 216, 0.3)'}
                strokeWidth={isActive ? 2.5 : 1.2}
                strokeDasharray={isActive ? 'none' : '4 4'}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
            );
          })}
        </svg>

        {/* Center Hub Core */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00B4D8 0%, #0284c7 100%)',
            border: '3px solid #66E5FF',
            boxShadow: '0 0 35px rgba(0, 180, 216, 0.6), 0 0 70px rgba(0, 180, 216, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          <ApiOutlined style={{ fontSize: 22, color: '#ffffff', marginBottom: 2 }} />
          <div style={{ fontWeight: 900, fontSize: 10, color: '#ffffff', letterSpacing: '0.6px', lineHeight: 1.1 }}>
            ALGONEX
          </div>
          <div style={{ fontWeight: 700, fontSize: 8, color: '#EBFBFF', letterSpacing: '0.3px' }}>
            CAMPUS CREW
          </div>
        </div>

        {/* Orbiting Nodes (Circle + Icon + Label) */}
        {NODES.map((node) => {
          const rad = ((node.angle + rotation) * Math.PI) / 180;
          const xPct = 50 + orbitRadiusPct * Math.cos(rad);
          const yPct = 50 + orbitRadiusPct * Math.sin(rad);
          const isActive = activeNode === node.id;

          return (
            <div
              key={`node-wrapper-${node.id}`}
              onMouseEnter={() => {
                setActiveNode(node.id);
                setIsHovered(true);
              }}
              onMouseLeave={() => setActiveNode(null)}
              style={{
                position: 'absolute',
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.25 : 1})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: isActive ? 20 : 5,
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Node Circle with Centered Icon inside */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: isActive ? node.color : '#0f172a',
                  border: isActive ? `3px solid ${node.color}` : `2px solid ${node.color}`,
                  boxShadow: isActive
                    ? `0 0 25px ${node.color}, 0 4px 14px rgba(0,0,0,0.5)`
                    : `0 0 12px ${node.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 19,
                  color: isActive ? '#ffffff' : node.color,
                  transition: 'background 0.25s, border 0.25s, color 0.25s, box-shadow 0.25s',
                }}
              >
                {node.icon}
              </div>

              {/* Node Label right below circle */}
              <div
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: isActive ? 800 : 700,
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                  textShadow: isActive
                    ? `0 0 8px ${node.color}`
                    : '0 2px 4px rgba(0,0,0,0.9)',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.3px',
                  transition: 'color 0.2s',
                }}
              >
                {node.label}
              </div>

              {/* Floating Hover Pop-up Tooltip */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    marginBottom: 8,
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: `1px solid ${node.color}`,
                    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px ${node.color}44`,
                    borderRadius: 10,
                    padding: '6px 12px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    animation: 'fadeIn 0.2s ease',
                    zIndex: 30,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: node.color }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.85)', marginTop: 2 }}>
                    {node.desc}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveEcosystem;
