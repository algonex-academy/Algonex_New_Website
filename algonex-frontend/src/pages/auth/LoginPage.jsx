import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Divider, Card, App } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      const err = error.response?.data?.error;
      const fieldError = err?.details
        ? Object.values(err.details).flat()[0]
        : null;
      const msg =
        fieldError ||
        error.response?.data?.non_field_errors?.[0] ||
        err?.message ||
        "Login failed. Please check your credentials.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: 24 }}>
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Welcome Back</h2>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>or</Divider>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button
            icon={<GoogleOutlined />}
            block
            size="large"
            onClick={() => {
              const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
              if (!clientId) { message.warning("Google Auth is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file."); return; }
              const redirectUri = encodeURIComponent(window.location.origin + "/auth/callback");
              window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&state=google`;
            }}
          >
            Continue with Google
          </Button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: "#888" }}>Forgot password?</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </Card>
    </div>
  );
}
