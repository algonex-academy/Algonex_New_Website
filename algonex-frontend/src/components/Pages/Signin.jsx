import React, { useState } from 'react';
import { User, BookOpen, GraduationCap, Briefcase, Calendar, Mail, Phone, MapPin } from 'lucide-react';

const Signin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    college: '',
    location: '',
    course_interested: '',
    employment_status: 'fresher',
    years_of_experience: '',
    passed_out_year: '',
    specific_interests: '',
    agreed_to_terms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const courses = [
    'Java Full Stack',
    'Python Full Stack',
    'MERN Stack',
    'MEAN Stack',
    'Data Science',
    'Machine Learning',
    'DevOps Engineering',
    'Cloud Computing (AWS/Azure)',
    'Cyber Security',
    'Data Engineering',
    'React JS',
    'Node JS',
    'Angular',
    'Generative AI',
    'Other'
  ];

  const branches = [
    'Computer Science Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Bachelor of Computer Applications (BCA)',
    'Bachelor of Science (B.Sc)',
    'Master of Computer Applications (MCA)',
    'Other'
  ];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.push(i);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Full name is required';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email';
  }

  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
    newErrors.phone = 'Please enter a valid 10-digit phone number';
  }

  if (!formData.education) {
    newErrors.education = 'Please select your education';
  }

  if (!formData.branch) {
    newErrors.branch = 'Please select your branch';
  }

  if (!formData.college.trim()) {
    newErrors.college = 'College name is required';
  }

  if (!formData.course_interested) {
    newErrors.course_interested = 'Please select a course';
  }

  if (formData.employment_status === 'experienced' && !formData.years_of_experience) {
    newErrors.years_of_experience = 'Please specify years of experience';
  }

  if (!formData.passed_out_year) {
    newErrors.passed_out_year = 'Please select passed out year';
  }

  if (!formData.agreed_to_terms) {
    newErrors.agreed_to_terms = 'Please agree to the terms and conditions';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


 const handleSubmit = async (e) => {
  e.preventDefault();

  // if (!validateForm()) return;

  setIsSubmitting(true);
  setErrors({});
  setSubmitSuccess(false);

  try {
    const response = await fetch('http://localhost:8000/api/signin/signin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Form submitted:', result);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        resetForm();
      }, 3000);
    } else {
      console.error('Submission error:', result);
      alert('Submission failed. Please check your inputs.');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};



  const resetForm = () => {
  setFormData({
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    location: '',
    course_interested: '',
    employment_status: 'fresher',
    years_of_experience: '',
    passed_out_year: '',
    specific_interests: '',
    agreed_to_terms: false
  });
  setErrors({});
};


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CCF6FF] via-[#E0F7FF] to-[#B3E5FF] py-12 px-4">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Join Algonex Academy</h1>
          <p className="text-xl text-gray-600">Start your journey to a successful tech career today</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white p-8">
            <h2 className="text-3xl font-bold mb-2">Registration Form</h2>
            <p className="text-lg">Please fill in your details to get started</p>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#00B4D8] rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.name
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#00B4D8]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#00B4D8]'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Location/City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Your city"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#00B4D8] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Educational Background</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Branch/Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none bg-white cursor-pointer ${
                      errors.branch
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                  >
                    <option value="">Select your branch</option>
                    {branches.map((branch, index) => (
                      <option key={index} value={branch}>{branch}</option>
                    ))}
                  </select>
                  {errors.branch && (
                    <p className="text-red-500 text-sm mt-1">{errors.branch}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    College/University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Enter your college name"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.college
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                  />
                  {errors.college && (
                    <p className="text-red-500 text-sm mt-1">{errors.college}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Passed Out Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="passed_out_year"
                      value={formData.passed_out_year}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none bg-white cursor-pointer ${
                        errors.passed_out_year
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#00B4D8]'
                      }`}
                    >
                      <option value="">Select year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  {errors.passed_out_year && (
                    <p className="text-red-500 text-sm mt-1">{errors.passed_out_year}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#00B4D8] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Course Interests</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Course Interested In <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="course_interested"
                    value={formData.course_interested}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none bg-white cursor-pointer ${
                      errors.course_interested
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                  >
                    <option value="">Select a course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </select>
                  {errors.course_interested && (
                    <p className="text-red-500 text-sm mt-1">{errors.course_interested}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#00B4D8] rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Employment Status</h3>
              </div>

              <div className="space-y-6">
                <div className="flex gap-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="employment_status"
                      value="fresher"
                      checked={formData.employment_status === 'fresher'}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#00B4D8] focus:ring-[#00B4D8]"
                    />
                    <span className="text-lg font-semibold text-gray-700">Fresher</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="employment_status"
                      value="experienced"
                      checked={formData.employment_status === 'experienced'}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#00B4D8] focus:ring-[#00B4D8]"
                    />
                    <span className="text-lg font-semibold text-gray-700">Experienced</span>
                  </label>
                </div>

                {formData.employment_status === 'experienced' && (
                  <div className="max-w-md">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="years_of_experience"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none bg-white cursor-pointer ${
                        errors.years_of_experience
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-gray-200 focus:border-[#00B4D8]'
                      }`}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-3">2-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                    {errors.years_of_experience && (
                      <p className="text-red-500 text-sm mt-1">{errors.years_of_experience}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Any Specific Interests or Questions?
              </label>
              <textarea
                name="specific_interests"
                value={formData.specific_interests}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your learning goals, preferred timing, or any questions you have..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="bg-[#E6FAFF] rounded-xl p-6 mb-8 border-2 border-[#66E5FF]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreed_to_terms"
                  checked={formData.agreed_to_terms}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#00B4D8] rounded focus:ring-[#00B4D8] mt-1"
                />
                <span className="text-gray-700">
                  I agree to receive course information, updates, and promotional materials from Algonex Academy. 
                  I understand that my information will be used in accordance with the privacy policy.
                </span>
              </label>
              {errors.agreed_to_terms && (
                <p className="text-red-500 text-sm mt-2 ml-8">{errors.agreed_to_terms}</p>
              )}
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
              >
                Reset Form
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-12 py-4 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Already have an account? <a href="#" className="text-[#00B4D8] font-semibold hover:text-[#0077B6]">Sign In</a></p>
          <p className="mt-4">Need help? Contact us at <a href="mailto:info@algonexacademy.com" className="text-[#00B4D8] font-semibold hover:text-[#0077B6]">info@algonexacademy.com</a> or call <a href="tel:+911800123456" className="text-[#00B4D8] font-semibold hover:text-[#0077B6]">+91 1800-123-4567</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signin;