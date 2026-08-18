import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin, App } from "antd";
import apiClient from "../../api/client";
import { useAuth } from "../../hooks/useAuth";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { message } = App.useApp();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // "google" or "github"
    if (!code || !state) {
      setError("No authorization code received.");
      return;
    }

    const endpoint = state === "github" ? "/auth/github/" : "/auth/google/";

    apiClient.post(endpoint, { code })
      .then(async (response) => {
        const { access, refresh } = response.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        await refreshUser();
        message.success("Logged in successfully!");
        navigate("/", { replace: true });
      })
      .catch(() => {
        setError("OAuth login failed. Please try again.");
        message.error("OAuth login failed.");
      });
  }, [searchParams, navigate, message, refreshUser]);

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x26A0;&#xFE0F;</div>
          <h2 style={{ marginBottom: 8 }}>Login Failed</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>{error}</p>
          <a href="/signin"><button style={{ padding: "10px 24px", background: "#00B4D8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15 }}>Back to Sign In</button></a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 100 }}>
      <Spin size="large" tip="Completing login..." />
    </div>
  );
}
