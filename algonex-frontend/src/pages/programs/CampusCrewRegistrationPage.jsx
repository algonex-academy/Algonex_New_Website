import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Checkbox, message, Spin, Alert } from 'antd';
import { ArrowLeft, Copy, Check, Building, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

export default function CampusCrewRegistrationPage() {
  const { type: paramType } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Selected flow: 'selection', 'student', or 'college'
  const activeType = paramType === 'student' || paramType === 'college' ? paramType : 'selection';

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [genericError, setGenericError] = useState('');
  const [copied, setCopied] = useState(false);

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    college_name: '',
    department: '',
    year_of_study: '',
    student_primary_interest: 'AI',
    city: '',
    whatsapp_opt_in: false,
    privacy_acknowledged: false,
    website_hp: '',
  });

  // College Form State
  const [collegeForm, setCollegeForm] = useState({
    institution_name: '',
    full_name: '',
    designation: '',
    official_email: '',
    phone: '',
    city: '',
    college_primary_interest: 'Campus Crew chapter',
    authority_confirmed: false,
    privacy_acknowledged: false,
    message: '',
    whatsapp_opt_in: false,
    website_hp: '',
  });

  // Prefill authenticated user details safely
  useEffect(() => {
    if (user) {
      const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || '';
      setStudentForm((prev) => ({
        ...prev,
        full_name: prev.full_name || name,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
      setCollegeForm((prev) => ({
        ...prev,
        full_name: prev.full_name || name,
        official_email: prev.official_email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Set document title
  useEffect(() => {
    document.title = activeType === 'student'
      ? "Join Algonex Campus Crew — Student Registration"
      : activeType === 'college'
      ? "Bring Algonex Campus Crew to Your Campus"
      : "Algonex Campus Crew Registration";
  }, [activeType]);

  const handleStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCollegeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCollegeForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGenericError('');

    try {
      const response = await apiClient.post('/programs/campus-crew/register/', {
        registration_type: 'student',
        ...studentForm,
      });

      if (response.data?.status === 'success') {
        setSuccessData(response.data.data);
      }
    } catch (err) {
      if (err.response?.data?.error?.details) {
        setFieldErrors(err.response.data.error.details);
      } else {
        setGenericError("We couldn't submit this right now. Your details are still here—please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGenericError('');

    try {
      const response = await apiClient.post('/programs/campus-crew/register/', {
        registration_type: 'college',
        ...collegeForm,
      });

      if (response.data?.status === 'success') {
        setSuccessData(response.data.data);
      }
    } catch (err) {
      if (err.response?.data?.error?.details) {
        setFieldErrors(err.response.data.error.details);
      } else {
        setGenericError("We couldn't submit this right now. Your details are still here—please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRef = (refId) => {
    navigator.clipboard.writeText(refId);
    setCopied(true);
    message.success("Reference ID copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  // SUCCESS STATE VIEW
  if (successData) {
    const isStudent = successData.registration_type === 'student';
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-lg w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <Check size={36} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isStudent ? "You're in!" : "Request received"}
          </h1>
          <p className="text-slate-600 text-sm mb-6">
            {successData.message}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Reference ID</span>
              <span className="text-base font-mono font-bold text-slate-900">{successData.reference_id}</span>
            </div>
            <button
              onClick={() => handleCopyRef(successData.reference_id)}
              className="p-2 text-slate-600 hover:text-[#00B4D8] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Copy Reference ID"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <Link to="/campus-crew">
            <Button type="primary" size="large" block className="h-11 font-semibold rounded-lg">
              Back to Campus Crew
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // SELECTION LANDING PAGE VIEW
  if (activeType === 'selection') {
    return (
      <div className="min-h-[85vh] bg-slate-900 text-white flex flex-col justify-center px-4 py-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00B4D8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
          <div className="inline-block bg-[#00B4D8]/10 border border-[#00B4D8]/30 rounded-full px-4 py-1.5 text-[#66E5FF] text-xs font-semibold tracking-wider uppercase mb-6">
            Algonex Campus Crew
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Building India's Industry-to-Campus Innovation Network
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium mb-8">
            Learn. Build. Innovate. Connect. Lead.
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-10">
            Join as a student or connect your college with Algonex Campus Crew.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Student Choice */}
            <div
              onClick={() => navigate('/campus-crew/register/student')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-[#00B4D8] rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer group hover:shadow-xl hover:shadow-[#00B4D8]/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#00B4D8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I'm a Student</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Join the Campus Crew network. Connect with industry experts, gain hands-on tech exposure, and build real products.
                </p>
              </div>
              <div className="flex items-center text-[#00B4D8] text-sm font-semibold group-hover:translate-x-1 transition-transform">
                <span>Join Network</span>
                <ArrowRight size={16} className="ml-1" />
              </div>
            </div>

            {/* College Choice */}
            <div
              onClick={() => navigate('/campus-crew/register/college')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-[#00B4D8] rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer group hover:shadow-xl hover:shadow-[#00B4D8]/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Building size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I Represent a College</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Start a campus collaboration conversation. Bring workshops, hackathons, and project mentorship to your institution.
                </p>
              </div>
              <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                <span>Start Conversation</span>
                <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STUDENT REGISTRATION FORM
  if (activeType === 'student') {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-xl mx-auto">
          <Link to="/campus-crew" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Campus Crew</span>
          </Link>


          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Join Algonex Campus Crew</h1>
              <p className="text-xs text-slate-500 mt-1">Tell us where you study and what you want to learn.</p>
            </div>

            {genericError && (
              <Alert message={genericError} type="error" showIcon className="mb-6 rounded-lg text-xs" />
            )}

            {Object.keys(fieldErrors).length > 0 && (
              <Alert
                message="Please fix the errors below before submitting."
                type="error"
                showIcon
                className="mb-6 rounded-lg text-xs"
              />
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {/* Honeypot field */}
              <input
                type="text"
                name="website_hp"
                value={studentForm.website_hp}
                onChange={handleStudentChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={studentForm.full_name}
                  onChange={handleStudentChange}
                  autoComplete="name"
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.full_name ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.full_name && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.full_name[0]}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email address *</label>
                <input
                  type="email"
                  name="email"
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  autoComplete="email"
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.email && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.email[0]}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={studentForm.phone}
                  onChange={handleStudentChange}
                  autoComplete="tel"
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.phone && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.phone[0]}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">College/University *</label>
                <input
                  type="text"
                  name="college_name"
                  value={studentForm.college_name}
                  onChange={handleStudentChange}
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.college_name ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.college_name && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.college_name[0]}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department/Branch *</label>
                  <input
                    type="text"
                    name="department"
                    value={studentForm.department}
                    onChange={handleStudentChange}
                    required
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.department ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                  />
                  {fieldErrors.department && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.department[0]}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year of study *</label>
                  <select
                    name="year_of_study"
                    value={studentForm.year_of_study}
                    onChange={handleStudentChange}
                    required
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.year_of_study ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                  {fieldErrors.year_of_study && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.year_of_study[0]}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary area of interest *</label>
                <select
                  name="student_primary_interest"
                  value={studentForm.student_primary_interest}
                  onChange={handleStudentChange}
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.student_primary_interest ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                >
                  <option value="AI">AI & Machine Learning</option>
                  <option value="Web/App Development">Web/App Development</option>
                  <option value="Data">Data Science & Analytics</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud/DevOps">Cloud & DevOps</option>
                  <option value="Entrepreneurship/Innovation">Entrepreneurship & Innovation</option>
                  <option value="Other">Other</option>
                </select>
                {fieldErrors.student_primary_interest && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.student_primary_interest[0]}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City (Optional)</label>
                <input
                  type="text"
                  name="city"
                  value={studentForm.city}
                  onChange={handleStudentChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacy_acknowledged"
                    checked={studentForm.privacy_acknowledged}
                    onChange={handleStudentChange}
                    required
                    className="mt-0.5 rounded text-[#00B4D8] focus:ring-[#00B4D8]"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    I acknowledge the <Link to="/privacy" target="_blank" className="text-[#00B4D8] underline hover:text-[#0891b2]">Privacy Policy</Link> *
                  </span>
                </label>
                {fieldErrors.privacy_acknowledged && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.privacy_acknowledged[0]}</span>}
              </div>

              <div className="pt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="h-11 font-semibold rounded-lg bg-[#00B4D8] hover:bg-[#0891b2]"
                >
                  Join Campus Crew
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // COLLEGE INQUIRY FORM
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Link to="/campus-crew" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Campus Crew</span>
        </Link>


        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Bring Algonex Campus Crew to Your Campus</h1>
            <p className="text-xs text-slate-500 mt-1">Tell us who to contact and what your college is interested in.</p>
          </div>

          {genericError && (
            <Alert message={genericError} type="error" showIcon className="mb-6 rounded-lg text-xs" />
          )}

          {Object.keys(fieldErrors).length > 0 && (
            <Alert
              message="Please fix the errors below before submitting."
              type="error"
              showIcon
              className="mb-6 rounded-lg text-xs"
            />
          )}

          <form onSubmit={handleCollegeSubmit} className="space-y-4">
            {/* Honeypot field */}
            <input
              type="text"
              name="website_hp"
              value={collegeForm.website_hp}
              onChange={handleCollegeChange}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institution name *</label>
              <input
                type="text"
                name="institution_name"
                value={collegeForm.institution_name}
                onChange={handleCollegeChange}
                required
                className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.institution_name ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
              />
              {fieldErrors.institution_name && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.institution_name[0]}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full name *</label>
              <input
                type="text"
                name="full_name"
                value={collegeForm.full_name}
                onChange={handleCollegeChange}
                autoComplete="name"
                required
                className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.full_name ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
              />
              {fieldErrors.full_name && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.full_name[0]}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation/Role *</label>
                <input
                  type="text"
                  name="designation"
                  value={collegeForm.designation}
                  onChange={handleCollegeChange}
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.designation ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.designation && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.designation[0]}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official email address *</label>
                <input
                  type="email"
                  name="official_email"
                  value={collegeForm.official_email}
                  onChange={handleCollegeChange}
                  autoComplete="email"
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.official_email ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.official_email && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.official_email[0]}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={collegeForm.phone}
                  onChange={handleCollegeChange}
                  autoComplete="tel"
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.phone && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.phone[0]}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={collegeForm.city}
                  onChange={handleCollegeChange}
                  required
                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.city ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
                />
                {fieldErrors.city && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.city[0]}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary interest *</label>
              <select
                name="college_primary_interest"
                value={collegeForm.college_primary_interest}
                onChange={handleCollegeChange}
                required
                className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8] ${fieldErrors.college_primary_interest ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
              >
                <option value="Campus Crew chapter">Campus Crew chapter</option>
                <option value="Workshop or expert session">Workshop or expert session</option>
                <option value="Student project program">Student project program</option>
                <option value="Hackathon or innovation activity">Hackathon or innovation activity</option>
                <option value="Discuss options">Discuss options</option>
              </select>
              {fieldErrors.college_primary_interest && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.college_primary_interest[0]}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message (Optional)</label>
              <textarea
                name="message"
                rows="3"
                maxLength={500}
                value={collegeForm.message}
                onChange={handleCollegeChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">Anything important we should know?</span>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="authority_confirmed"
                  checked={collegeForm.authority_confirmed}
                  onChange={handleCollegeChange}
                  required
                  className="mt-0.5 rounded text-[#00B4D8] focus:ring-[#00B4D8]"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I confirm I am authorized to make this inquiry for the institution *
                </span>
              </label>
              {fieldErrors.authority_confirmed && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.authority_confirmed[0]}</span>}

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacy_acknowledged"
                  checked={collegeForm.privacy_acknowledged}
                  onChange={handleCollegeChange}
                  required
                  className="mt-0.5 rounded text-[#00B4D8] focus:ring-[#00B4D8]"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I acknowledge the <Link to="/privacy" target="_blank" className="text-[#00B4D8] underline hover:text-[#0891b2]">Privacy Policy</Link> *
                </span>
              </label>
              {fieldErrors.privacy_acknowledged && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.privacy_acknowledged[0]}</span>}
            </div>

            <div className="pt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="h-11 font-semibold rounded-lg bg-[#00B4D8] hover:bg-[#0891b2]"
              >
                Request a Conversation
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
