import { useState, useEffect } from 'react';
import { LinkedinOutlined, InstagramOutlined } from '@ant-design/icons';
import apiClient from '../api/client';

const FALLBACK_BANNER = {
  text: "Real-time Product Development Training & Internships – 20% Off NOW! | Contact: 9959789424",
  bg_color: "#00D4FF",
  text_color: "#000000",
  link: "",
};

const AnnouncementBanner = () => {
  // null = render nothing (still loading, or admin deactivated the banner)
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    apiClient.get("/banner/")
      .then((res) => {
        // API returns data: null when the banner is deactivated — respect it
        // and render nothing instead of falling back to the hardcoded promo.
        setBanner(res.data?.data || null);
      })
      .catch(() => {
        // Only use the hardcoded default when the API call itself fails.
        setBanner(FALLBACK_BANNER);
      });
  }, []);

  if (!banner) return null;

  return (
    <div className="announcement-banner" style={{
      background: banner.bg_color,
      color: banner.text_color,
      padding: "10px 24px",
      fontWeight: 600,
      fontSize: 14,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{`
        .announcement-banner-content {
          text-align: center;
          width: 100%;
          white-space: pre-wrap;
        }
        .announcement-banner-content a {
          color: ${banner.text_color};
          text-decoration: none;
        }
        .announcement-banner-content a:hover {
          text-decoration: underline;
        }
        .announcement-banner-socials {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .banner-social-icon {
          color: ${banner.text_color};
          display: inline-flex;
          align-items: center;
          font-size: 18px;
          transition: opacity 0.2s, transform 0.2s;
          opacity: 0.85;
          text-decoration: none;
        }
        .banner-social-icon:hover {
          opacity: 1;
          transform: scale(1.1);
        }
        @media (min-width: 768px) {
          .announcement-banner {
            flex-direction: row;
          }
          .announcement-banner-socials {
            position: absolute;
            right: 24px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        @media (max-width: 767px) {
          .announcement-banner {
            flex-direction: column;
            gap: 8px;
            padding: 12px 24px;
          }
          .announcement-banner-socials {
            justify-content: center;
          }
        }
      `}</style>

      <div className="announcement-banner-content">
        {banner.link ? (
          <a href={banner.link}>
            {banner.text ? banner.text.replace(/\\n/g, '\n') : ''}
          </a>
        ) : (banner.text ? banner.text.replace(/\\n/g, '\n') : '')}
      </div>

      <div className="announcement-banner-socials">
        <a
          href="https://www.linkedin.com/company/algonex-it-solutions/"
          target="_blank"
          rel="noopener noreferrer"
          className="banner-social-icon"
          aria-label="LinkedIn"
        >
          <LinkedinOutlined />
        </a>
        <a
          href="https://www.instagram.com/algonex_techies/"
          target="_blank"
          rel="noopener noreferrer"
          className="banner-social-icon"
          aria-label="Instagram"
        >
          <InstagramOutlined />
        </a>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
