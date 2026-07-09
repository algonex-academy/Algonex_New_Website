import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, Card, App } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register({
        email: values.email,
        password1: values.password,
        password2: values.confirmPassword,
        first_name: values.firstName,
        last_name: values.lastName,
      });
      message.success("Account created! Welcome to Algonex.");
      navigate("/");
    } catch (error) {
      const errors = error.response?.data;
      const details = errors?.error?.details;
      // Show the first specific field error from details (e.g. "This password is too common.")
      const fieldError = details
        ? Object.values(details).flat()[0]
        : null;
      const msg =
        fieldError ||
        errors?.error?.message ||
        "Registration failed. Please try again.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: 24 }}>
      <Card style={{ width: "100%", maxWidth: 440 }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Create Account</h2>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "First name required" }]}
              style={{ flex: "1 1 180px", minWidth: 0 }}
            >
              <Input prefix={<UserOutlined />} placeholder="First name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Last name required" }]}
              style={{ flex: "1 1 180px", minWidth: 0 }}
            >
              <Input placeholder="Last name" />
            </Form.Item>
          </div>

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
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Create Account
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
              if (!clientId) {
                message.error("Google Auth is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file.");
                return;
              }
              const redirectUri = encodeURIComponent(window.location.origin + "/auth/callback");
              window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&state=google`;
            }}
          >
            Sign up with Google
          </Button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}
