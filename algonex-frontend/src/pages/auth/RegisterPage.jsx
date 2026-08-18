import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Form, Input, Button, Card, Steps, Select, InputNumber,
  Checkbox, Row, Col, Alert, Result, App,
} from "antd";
import {
  UserOutlined, MailOutlined, PhoneOutlined,
  HomeOutlined, BookOutlined, BankOutlined,
  ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import { registrationAPI } from "../../api/registration";
import { programsAPI } from "../../api/programs";

const DEGREE_LEVELS = [
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

const EMPLOYMENT_STATUSES = [
  { value: "student", label: "Student" },
  { value: "employed", label: "Employed" },
  { value: "freelancer", label: "Freelancer" },
  { value: "unemployed", label: "Unemployed" },
];

const INTEREST_CATEGORIES = [
  { value: "fellowship", label: "Fellowship" },
  { value: "internship", label: "Internship" },
  { value: "workshop", label: "Workshop" },
  { value: "course", label: "Course" },
  { value: "other", label: "Other" },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState(null);
  const [step1Response, setStep1Response] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [programName, setProgramName] = useState(null);
  const [searchParams] = useSearchParams();
  const [step1Form] = Form.useForm();
  const [step2Form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const programSlug = searchParams.get("program");

  // If coming from a program page, fetch program name for display
  useEffect(() => {
    if (programSlug) {
      programsAPI.detail(programSlug)
        .then((res) => {
          const data = res.data?.data || res.data;
          setProgramName(data?.title);
          // Pre-select interest category based on program type
          const pType = data?.program_type;
          if (pType) {
            step2Form.setFieldValue("interest_category", pType);
          }
        })
        .catch(() => {});
    }
  }, [programSlug, step2Form]);

  const handleStep1 = async (values) => {
    setLoading(true);
    try {
      const res = await registrationAPI.step1(values);
      const data = res.data?.data || res.data;
      setStep1Data(values);
      setStep1Response(data);
      setCurrentStep(1);
    } catch (err) {
      const apiErr = err.response?.data?.error;
      const fieldError = apiErr?.details
        ? Object.values(apiErr.details).flat()[0]
        : null;
      const msg = fieldError || apiErr?.message || "Registration failed. Please try again.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: step1Data.email,
        // proves this browser completed step1 for this email (anti-IDOR)
        reg_token: step1Response?.reg_token,
        ...values,
        terms_agreed: values.terms_agreed || false,
      };
      if (programSlug) {
        payload.program_slug = programSlug;
      }
      await registrationAPI.step2(payload);
      setDone(true);
      setCurrentStep(2);
    } catch (err) {
      const apiErr = err.response?.data?.error;
      const fieldError = apiErr?.details
        ? Object.values(apiErr.details).flat()[0]
        : null;
      const msg = fieldError || apiErr?.message || "Failed to save profile. Please try again.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (done) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: 24 }}>
        <Card style={{ width: "100%", maxWidth: 600, textAlign: "center" }}>
          <Result
            status="success"
            title="Registration Complete!"
            subTitle={
              programName
                ? `You've registered your interest in ${programName}. We'll be in touch soon.`
                : "Your registration has been submitted. We'll be in touch soon."
            }
            extra={[
              <Button type="primary" key="password" onClick={() => navigate("/signin")}>
                Set Up Password & Sign In
              </Button>,
              <Button key="programs" onClick={() => navigate("/programs")}>
                Browse Programs
              </Button>,
            ]}
          />
          <Alert
            type="info"
            showIcon
            message="Want to access your account later?"
            description="You can set up a password anytime from the Sign In page using your registered email."
            style={{ textAlign: "left", marginTop: 16 }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #0c1222, #0a2540)",
          padding: "40px 24px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, marginBottom: 8 }}>
          {programName ? `Register for ${programName}` : "Register"}
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto" }}>
          {programName
            ? "Complete the form below to express your interest and create an account."
            : "Join Algonex — complete the form to create your account."
          }
        </p>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px" }}>
        {/* Steps indicator */}
        <Steps
          current={currentStep}
          items={[
            { title: "Basic Info" },
            { title: "Profile Details" },
            { title: "Done" },
          ]}
          style={{ marginBottom: 32 }}
        />

        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <Card style={{ borderRadius: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Basic Information</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>Tell us who you are and set up your password</p>

            <Form
              form={step1Form}
              layout="vertical"
              onFinish={handleStep1}
              size="large"
              initialValues={step1Data || {}}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[{ required: true, message: "Please enter your first name" }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="First name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[{ required: true, message: "Please enter your last name" }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Last name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: "Please enter your phone number" }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+91 98765 43210" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter a password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Continue <ArrowRightOutlined />
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              Already have an account? <Link to="/signin">Sign in</Link>
            </div>
          </Card>
        )}

        {/* Step 2: Profile Details */}
        {currentStep === 1 && (
          <Card style={{ borderRadius: 12 }}>
            {/* Info banner for existing accounts */}
            {step1Response?.has_password && (
              <Alert
                type="warning"
                showIcon
                message="You already have an account with a password"
                description={
                  <span>
                    You can <Link to="/signin">sign in</Link> to manage your data, or continue below to update your registration profile.
                  </span>
                }
                style={{ marginBottom: 24 }}
              />
            )}
            {step1Response && !step1Response.is_new && !step1Response.has_password && (
              <Alert
                type="info"
                showIcon
                message="Welcome back! We found your email in our system."
                description="Continuing will update your existing registration profile."
                style={{ marginBottom: 24 }}
              />
            )}

            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Profile Details</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>Help us match you with the right opportunities</p>

            <Form
              form={step2Form}
              layout="vertical"
              onFinish={handleStep2}
              size="large"
            >
              {/* Address */}
              <div style={{ marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#2c3e50", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <HomeOutlined style={{ color: "#00B4D8" }} /> Address
                </h3>
              </div>
              <Form.Item name="street_address" label="Street Address">
                <Input placeholder="123 Main Street" />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: "Please enter your city" }]}
                  >
                    <Input placeholder="Bangalore" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[{ required: true, message: "Please enter your state" }]}
                  >
                    <Input placeholder="Karnataka" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    initialValue="India"
                    rules={[{ required: true, message: "Please enter your country" }]}
                  >
                    <Input placeholder="India" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="pincode" label="Pincode">
                    <Input placeholder="560001" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Education */}
              <div style={{ marginBottom: 8, marginTop: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#2c3e50", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <BookOutlined style={{ color: "#00B4D8" }} /> Education
                </h3>
              </div>
              <Form.Item
                name="college"
                label="College / University"
                rules={[{ required: true, message: "Please enter your college" }]}
              >
                <Input placeholder="Indian Institute of Technology" />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="branch"
                    label="Branch / Major"
                    rules={[{ required: true, message: "Please enter your branch" }]}
                  >
                    <Input placeholder="Computer Science" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="degree_level"
                    label="Degree Level"
                    rules={[{ required: true, message: "Please select your degree level" }]}
                  >
                    <Select placeholder="Select degree" options={DEGREE_LEVELS} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="graduation_year"
                    label="Graduation Year"
                    rules={[{ required: true, message: "Please enter your graduation year" }]}
                  >
                    <InputNumber placeholder="2027" min={2000} max={2035} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="current_year" label="Current Year">
                    <Input placeholder="e.g. 3rd year" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Employment */}
              <div style={{ marginBottom: 8, marginTop: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#2c3e50", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <BankOutlined style={{ color: "#00B4D8" }} /> Employment
                </h3>
              </div>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="employment_status"
                    label="Employment Status"
                    rules={[{ required: true, message: "Please select your status" }]}
                  >
                    <Select placeholder="Select status" options={EMPLOYMENT_STATUSES} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="years_of_experience" label="Years of Experience" initialValue={0}>
                    <InputNumber min={0} max={50} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Training Interest */}
              <div style={{ marginBottom: 8, marginTop: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#2c3e50", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircleOutlined style={{ color: "#00B4D8" }} /> Training Interest
                </h3>
              </div>
              {programName && (
                <Alert
                  type="success"
                  showIcon
                  message={`Registering for: ${programName}`}
                  style={{ marginBottom: 16 }}
                />
              )}
              <Form.Item
                name="interest_category"
                label="What are you interested in?"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select placeholder="Select category" options={INTEREST_CATEGORIES} />
              </Form.Item>
              <Form.Item name="specific_interests" label="Anything specific you'd like us to know?">
                <Input.TextArea rows={3} placeholder="Tell us about your goals, preferred technologies, schedule preferences..." />
              </Form.Item>

              {/* Terms */}
              <Form.Item
                name="terms_agreed"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject("You must agree to the terms"),
                  },
                ]}
              >
                <Checkbox>
                  I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and{" "}
                  <Link to="/privacy" target="_blank">Privacy Policy</Link>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    onClick={() => setCurrentStep(0)}
                    style={{ flex: "0 0 auto" }}
                  >
                    <ArrowLeftOutlined /> Back
                  </Button>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    Complete Registration <CheckCircleOutlined />
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
}
