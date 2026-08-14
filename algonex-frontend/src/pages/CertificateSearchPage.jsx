import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button, Card } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Option } = Select;

const CertificateSearchPage = () => {
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState('');
  const [batchType, setBatchType] = useState(undefined);

  const handleSearch = () => {
    const trimmed = certificateId.trim();
    if (!trimmed) return;
    navigate(`/verify/Certificate/ID=${trimmed}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', fontFamily: '"Outfit", "Inter", sans-serif' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '80px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
          top: -150, right: -100, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
          bottom: -100, left: '15%', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <SafetyCertificateOutlined style={{ fontSize: 56, color: '#38bdf8', marginBottom: 16 }} />
          <h1 style={{
            color: '#ffffff', fontSize: 40, fontWeight: 800, margin: '0 0 12px 0',
            fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.5px'
          }}>
            Certificate Verification
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 17, margin: 0, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Search and verify your Algonex certificate by entering your Certificate ID or Intern ID below.
          </p>
        </div>
      </div>

      {/* Search Card */}
      <div style={{ maxWidth: 600, margin: '-30px auto 0 auto', padding: '0 20px 60px', position: 'relative', zIndex: 10 }}>
        <Card style={{
          borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
          padding: '10px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ margin: '0 0 6px 0', fontSize: 22, fontWeight: 700, color: '#1e293b' }}>
              Find Your Certificate
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
              Select your batch type and enter your ID to verify and download your certificate.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                Batch Type
              </label>
              <Select
                placeholder="Select batch type"
                value={batchType}
                onChange={(val) => setBatchType(val)}
                style={{ width: '100%' }}
                size="large"
                allowClear
              >
                <Option value="training">Training</Option>
                <Option value="internship">Internship</Option>
                <Option value="fellowship">Fellowship</Option>
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                Certificate ID / Intern ID
              </label>
              <Input
                placeholder="e.g. ALG26FCPF04296"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                size="large"
                onPressEnter={handleSearch}
                style={{ borderRadius: 8 }}
              />
            </div>

            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              disabled={!certificateId.trim()}
              style={{
                height: 48, borderRadius: 10, fontWeight: 700, fontSize: 15, marginTop: 4,
                background: !certificateId.trim() ? undefined : 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
                boxShadow: certificateId.trim() ? '0 4px 15px rgba(2,132,199,0.3)' : 'none',
                border: 'none'
              }}
              block
            >
              Search Certificate
            </Button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8' }}>
            Enter the offer ID provided while you registration to verify its authenticity.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CertificateSearchPage;
