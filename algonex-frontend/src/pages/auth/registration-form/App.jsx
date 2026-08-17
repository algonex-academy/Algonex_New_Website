import { useState, useCallback, useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import PersonalDetails from './components/PersonalDetails';
import TrainingDetails from './components/TrainingDetails';
import PaymentGateway from './components/PaymentGateway';
import SubmitButton from './components/SubmitButton';
import LoadingModal from './components/LoadingModal';
import SuccessModal from './components/SuccessModal';
import { validateAllFields } from './utils/validation';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  parentPhone: '',
  dob: '',
  gender: '',
  collegeName: '',
  branch: '',
  currentYear: '',
  city: '',
  state: '',
  courseSelected: '',
  otherCourse: '',
  batchType: '',
  joiningDate: '',
  totalFee: '',
  paidFee: '',
  upiTransactionId: '',
  whyJoinAlgonex: '',
  agreeTerms: false,
};

function App() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [shakeSection, setShakeSection] = useState(null);

  // Student ID generated when user clicks "Pay Now"
  const [generatedStudentId, setGeneratedStudentId] = useState(null);
  // Whether QR is revealed (after clicking "Pay Now")
  const [isQrRevealed, setIsQrRevealed] = useState(false);

  const [courseOptions, setCourseOptions] = useState([
    { value: '', label: 'Select Course', disabled: true },
    { value: 'Python Full Stack with AI', label: 'Python Full Stack with AI' },
    { value: 'Data Science with AI', label: 'Data Science with AI' },
    { value: 'Others', label: 'Others' }
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/courses/`);
        if (response.ok) {
          const data = await response.json();
          const courses = Array.isArray(data) ? data : (data.results || (data.data && data.data.results) || []);
          if (courses.length > 0) {
            const apiOptions = courses.map(c => ({ value: c.name, label: c.name }));
            setCourseOptions([
              { value: '', label: 'Select Course', disabled: true },
              ...apiOptions,
              { value: 'Others', label: 'Others' }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    // Filter out negative inputs for numeric fee fields
    if (name === 'totalFee' || name === 'paidFee') {
      if (value !== '') {
        const numVal = Number(value);
        if (isNaN(numVal) || numVal < 0 || value.includes('-')) {
          return;
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // If user changes Section A or B fields after QR was revealed, reset QR
    const sectionABFields = [
      'fullName', 'email', 'phone', 'parentPhone', 'dob', 'gender', 'collegeName',
      'branch', 'currentYear', 'city', 'state',
      'courseSelected', 'otherCourse', 'batchType', 'joiningDate', 'totalFee', 'paidFee',
    ];
    if (sectionABFields.includes(name)) {
      setIsQrRevealed(false);
      setGeneratedStudentId(null);
    }
  }, []);

  const handlePhotoChange = useCallback((file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Only image files are allowed.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'File size must be under 5MB.' }));
      return;
    }

    setPhoto(file);
    setErrors((prev) => ({ ...prev, photo: '' }));
    // Reset QR if photo changes
    setIsQrRevealed(false);
    setGeneratedStudentId(null);

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setPhoto(null);
    setPhotoPreview('');
    setErrors((prev) => ({ ...prev, photo: '' }));
    setIsQrRevealed(false);
    setGeneratedStudentId(null);
  }, []);

  // Called when user clicks "Pay Now" — validates Sections A & B, then generates ID and reveals QR
  const handlePayNow = useCallback(async () => {
    const personalFields = ['fullName', 'email', 'phone', 'parentPhone', 'dob', 'gender', 'collegeName', 'branch', 'currentYear', 'city', 'state'];
    const trainingFields = ['courseSelected', 'otherCourse', 'batchType', 'joiningDate', 'totalFee', 'agreeTerms'];
    const paymentFields = ['paidFee'];

    const validationErrors = validateAllFields(formData, photo);

    // Filter out upiTransactionId error since we haven't shown the input yet
    const sectionABErrors = {};
    Object.keys(validationErrors).forEach((key) => {
      if (key !== 'upiTransactionId') {
        sectionABErrors[key] = validationErrors[key];
      }
    });

    if (Object.keys(sectionABErrors).length > 0) {
      setErrors(sectionABErrors);

      const firstError = Object.keys(sectionABErrors)[0];
      if (personalFields.includes(firstError) || firstError === 'photo') {
        setShakeSection('personal');
      } else if (trainingFields.includes(firstError)) {
        setShakeSection('training');
      } else if (paymentFields.includes(firstError)) {
        setShakeSection('payment');
      }

      setTimeout(() => setShakeSection(null), 400);

      // Scroll to the first error element
      const errEl = document.getElementById(firstError === 'photo' ? 'photoInput' : firstError);
      if (errEl) {
        errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    try {
      const course = formData.courseSelected === 'Others' ? formData.otherCourse : formData.courseSelected;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/register/next-id/?course=${encodeURIComponent(course || '')}&batchType=${encodeURIComponent(formData.batchType || '')}`
      );
      if (response.ok) {
        const data = await response.json();
        setGeneratedStudentId(data.student_id);
        setIsQrRevealed(true);
      } else {
        throw new Error('Failed to generate sequential ID');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server for generating sequential Student ID. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, photo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAllFields(formData, photo);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const personalFields = ['fullName', 'email', 'phone', 'parentPhone', 'dob', 'gender', 'collegeName', 'branch', 'currentYear', 'city', 'state', 'photo'];
      const trainingFields = ['courseSelected', 'otherCourse', 'batchType', 'joiningDate', 'totalFee', 'agreeTerms'];
      const paymentFields = ['upiTransactionId', 'paidFee'];

      const firstError = Object.keys(validationErrors)[0];
      if (personalFields.includes(firstError)) {
        setShakeSection('personal');
      } else if (trainingFields.includes(firstError)) {
        setShakeSection('training');
      } else if (paymentFields.includes(firstError)) {
        setShakeSection('payment');
      }

      setTimeout(() => setShakeSection(null), 400);

      // Scroll to the first error element
      const errEl = document.getElementById(firstError === 'photo' ? 'photoInput' : firstError);
      if (errEl) {
        errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);

    const submitData = new FormData();
    submitData.append('photo', photo);
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'otherCourse') return; // Skip sending otherCourse separately
      if (key === 'courseSelected' && value === 'Others') {
        submitData.append('courseSelected', formData.otherCourse);
      } else {
        submitData.append(key, value);
      }
    });

    // Append calculated balance fee
    const balanceFee = Number(formData.totalFee || 0) - Number(formData.paidFee || 0);
    submitData.append('balanceFee', balanceFee);

    // Send the pre-generated student ID to backend
    if (generatedStudentId) {
      submitData.append('studentId', generatedStudentId);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/register/`, {
        method: 'POST',
        body: submitData,
      });

      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textError = await response.text();
        throw new Error(textError || `Server returned status ${response.status}`);
      }

      if (response.ok && data.success) {
        setIsLoading(false);
        setSuccessData({
          studentId: data.student_id,
          cardUrl: data.card_url,
          invoiceUrl: data.invoice_url,
          emailSent: data.email_sent,
          email: formData.email,
        });
        // Reset everything
        setFormData(INITIAL_FORM);
        setPhoto(null);
        setPhotoPreview('');
        setErrors({});
        setGeneratedStudentId(null);
        setIsQrRevealed(false);
      } else {
        const errMsg = data.error || data.detail || (typeof data === 'string' ? data : 'Registration failed. Please check inputs.');
        throw new Error(typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg);
      }
    } catch (err) {
      setIsLoading(false);
      alert(`Registration Error: ${err.message}`);
    }

  };

  const handleCloseSuccess = () => {
    setSuccessData(null);
  };

  return (
    <div className="registration-form-page">
      {/* Background glowing orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div className="glow-orb orb-3"></div>

      <div className="app-container">
        <Header />

        <form
          id="registrationForm"
          className="registration-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <PersonalDetails
            formData={formData}
            errors={errors}
            onChange={handleChange}
            photo={photo}
            photoPreview={photoPreview}
            onPhotoChange={handlePhotoChange}
            onRemovePhoto={handleRemovePhoto}
            shake={shakeSection === 'personal'}
          />

          <TrainingDetails
            formData={formData}
            errors={errors}
            onChange={handleChange}
            shake={shakeSection === 'training'}
            courseOptions={courseOptions}
          />

          {/* Payment Gateway is always visible, acts as the flow controller */}
          <PaymentGateway
            formData={formData}
            errors={errors}
            onChange={handleChange}
            shake={shakeSection === 'payment'}
            studentId={generatedStudentId}
            isQrRevealed={isQrRevealed}
            onPayNow={handlePayNow}
          />

          {isQrRevealed && <SubmitButton />}
        </form>
      </div>

      {isLoading && <LoadingModal />}
      {successData && (
        <SuccessModal data={successData} onClose={handleCloseSuccess} />
      )}
    </div>
  );
}

export default App;
