import React, { useState } from 'react';
import { Modal } from 'antd';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const CampusCrewModalForm = ({ isOpen, onClose, initialType = 'student' }) => {
  const [formType, setFormType] = useState(initialType);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    designation: '',
    course: '',
    year: '',
    city: '',
    studentStrength: '',
    organization: '',
    role: '',
    expertise: '',
    interests: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Form Validation
    if (!formData.name || !formData.email || !formData.phone || (!formData.college && formType !== 'industry')) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
    } catch (_err) {
      setStatus('error');
      setErrorMessage('Failed to submit application. Please try again.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({
      name: '',
      email: '',
      phone: '',
      college: '',
      designation: '',
      course: '',
      year: '',
      city: '',
      studentStrength: '',
      organization: '',
      role: '',
      expertise: '',
      interests: '',
      message: ''
    });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      closeIcon={<X className="text-slate-500 hover:text-slate-800" size={20} />}
      styles={{
        content: {
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          color: '#2c3e50'
        }
      }}
    >
      <div className="font-inter">
        {/* Form Type Tabs */}
        <div className="flex border-b border-slate-200 pb-3 mb-6 gap-4">
          <button
            onClick={() => { setFormType('college'); handleReset(); }}
            className={`text-sm font-bold pb-2 border-b-2 transition-all ${
              formType === 'college' ? 'border-[#00B4D8] text-[#00B4D8]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            College Partnership
          </button>
          <button
            onClick={() => { setFormType('student'); handleReset(); }}
            className={`text-sm font-bold pb-2 border-b-2 transition-all ${
              formType === 'student' ? 'border-[#00B4D8] text-[#00B4D8]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Cohort Join
          </button>
          <button
            onClick={() => { setFormType('industry'); handleReset(); }}
            className={`text-sm font-bold pb-2 border-b-2 transition-all ${
              formType === 'industry' ? 'border-[#00B4D8] text-[#00B4D8]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Industry Collaboration
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Application Received!</h3>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              Thank you for reaching out to Algonex IT Solutions regarding the Campus Crew program. Our team will review your application and connect with you shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#00B4D8] hover:bg-[#0891b2] text-white font-bold rounded-lg transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {formType === 'college' && 'Request Campus Discussion'}
                {formType === 'student' && 'Join Algonex Campus Crew'}
                {formType === 'industry' && 'Collaborate With Algonex'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the details below to initiate your engagement with Algonex IT Solutions.
              </p>
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                  required
                />
              </div>

              {formType !== 'industry' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / Institution *</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. IIT / NIT / University Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                    required
                  />
                </div>
              )}

              {formType === 'college' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Principal / HOD / TPO / Faculty"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City / Location</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Bengaluru, Hyderabad"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                    />
                  </div>
                </>
              )}

              {formType === 'student' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Branch</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="B.Tech CSE, IT, MCA"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Study</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </>
              )}

              {formType === 'industry' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Company</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Tech Company / Startup"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Designation</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Engineering Manager / Mentor"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Message / Note</label>
              <textarea
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your campus goals or how you would like to participate..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2 bg-[#00B4D8] hover:bg-[#0891b2] text-white font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-md"
              >
                {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
                {formType === 'college' && 'Request Discussion'}
                {formType === 'student' && 'Submit Application'}
                {formType === 'industry' && 'Collaborate Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
