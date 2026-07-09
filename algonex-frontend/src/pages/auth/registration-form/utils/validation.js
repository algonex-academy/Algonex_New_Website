/**
 * Validates all form fields and returns an errors object.
 * Keys with non-empty string values indicate invalid fields.
 */
export function validateAllFields(formData, photo) {
  const errors = {};

  // Photo validation
  if (!photo) {
    errors.photo = 'Please upload a passport photo.';
  }

  // Full Name
  if (!formData.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
  }

  // Email
  if (!formData.email.trim()) {
    errors.email = 'Email Address is required.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  // Password
  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  // Phone
  if (!formData.phone.trim()) {
    errors.phone = 'Phone Number is required.';
  } else {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }
  }

  // Parent/Guardian Phone
  if (!formData.parentPhone || !formData.parentPhone.trim()) {
    errors.parentPhone = 'Parent/Guardian Contact is required.';
  } else {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.parentPhone.trim().replace(/\s+/g, ''))) {
      errors.parentPhone = 'Please enter a valid 10-digit mobile number.';
    }
  }

  // Date of Birth
  if (!formData.dob) {
    errors.dob = 'Date of Birth is required.';
  }

  // Gender
  if (!formData.gender) {
    errors.gender = 'Please select your gender.';
  }

  // College Name
  if (!formData.collegeName.trim()) {
    errors.collegeName = 'College Name is required.';
  }

  // Branch
  if (!formData.branch.trim()) {
    errors.branch = 'Branch/Department is required.';
  }

  // Current Year
  if (!formData.currentYear) {
    errors.currentYear = 'Please select your current academic year.';
  }

  // City
  if (!formData.city.trim()) {
    errors.city = 'City is required.';
  }

  // State
  if (!formData.state.trim()) {
    errors.state = 'State is required.';
  }

  // Course Selected
  if (!formData.courseSelected) {
    errors.courseSelected = 'Please select a course track.';
  } else if (formData.courseSelected === 'Others') {
    if (!formData.otherCourse || !formData.otherCourse.trim()) {
      errors.otherCourse = 'Please specify your course name.';
    }
  }

  // Batch Type
  if (!formData.batchType) {
    errors.batchType = 'Please select a batch type.';
  }

  // Joining Date
  if (!formData.joiningDate) {
    errors.joiningDate = 'Joining Date is required.';
  }

  // UPI Transaction ID
  if (!formData.upiTransactionId.trim()) {
    errors.upiTransactionId = 'A valid transaction ID is required to complete registration.';
  } else if (formData.upiTransactionId.trim().length < 8) {
    errors.upiTransactionId = 'UPI Transaction Reference must be at least 8 characters.';
  }

  // Total Course Fee
  const totalFeeNum = Number(formData.totalFee);
  if (!formData.totalFee || isNaN(totalFeeNum) || totalFeeNum <= 0) {
    errors.totalFee = 'Total Course Fee must be a valid positive number.';
  }

  // Paid Fee
  const paidFeeNum = Number(formData.paidFee);
  if (!formData.paidFee || isNaN(paidFeeNum) || paidFeeNum <= 0) {
    errors.paidFee = 'Paying Amount must be a valid positive number.';
  } else if (paidFeeNum > totalFeeNum) {
    errors.paidFee = 'Paid Fee cannot exceed Total Course Fee.';
  }

  // Agree Terms
  if (!formData.agreeTerms) {
    errors.agreeTerms = 'You must agree to the Terms & Conditions.';
  }

  return errors;
}

/**
 * Validate a single field and return the error message (or empty string if valid).
 */
export function validateField(name, value) {
  switch (name) {
    case 'fullName':
      return !value.trim() ? 'Full Name is required.' : '';
    case 'email': {
      if (!value.trim()) return 'Email Address is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value.trim()) ? 'Please enter a valid email address.' : '';
    }
    case 'password': {
      if (!value) return 'Password is required.';
      return value.length < 8 ? 'Password must be at least 8 characters.' : '';
    }
    case 'phone': {
      if (!value.trim()) return 'Phone Number is required.';
      const phoneRegex = /^[6-9]\d{9}$/;
      return !phoneRegex.test(value.trim().replace(/\s+/g, ''))
        ? 'Please enter a valid 10-digit mobile number.'
        : '';
    }
    case 'parentPhone': {
      if (!value || !value.trim()) return 'Parent/Guardian Contact is required.';
      const phoneRegex = /^[6-9]\d{9}$/;
      return !phoneRegex.test(value.trim().replace(/\s+/g, ''))
        ? 'Please enter a valid 10-digit mobile number.'
        : '';
    }
    case 'dob':
      return !value ? 'Date of Birth is required.' : '';
    case 'gender':
      return !value ? 'Please select your gender.' : '';
    case 'collegeName':
      return !value.trim() ? 'College Name is required.' : '';
    case 'branch':
      return !value.trim() ? 'Branch/Department is required.' : '';
    case 'currentYear':
      return !value ? 'Please select your current academic year.' : '';
    case 'city':
      return !value.trim() ? 'City is required.' : '';
    case 'state':
      return !value.trim() ? 'State is required.' : '';
    case 'courseSelected':
      return !value ? 'Please select a course track.' : '';
    case 'otherCourse':
      return !value || !value.trim() ? 'Please specify your course name.' : '';
    case 'batchType':
      return !value ? 'Please select a batch type.' : '';
    case 'joiningDate':
      return !value ? 'Joining Date is required.' : '';
    case 'upiTransactionId': {
      if (!value.trim()) return 'A valid transaction ID is required to complete registration.';
      return value.trim().length < 8
        ? 'UPI Transaction Reference must be at least 8 characters.'
        : '';
    }
    case 'totalFee': {
      const val = Number(value);
      if (!value || isNaN(val) || val <= 0) return 'Total Course Fee must be a valid positive number.';
      return '';
    }
    case 'paidFee': {
      const val = Number(value);
      if (!value || isNaN(val) || val <= 0) return 'Paying Amount must be a valid positive number.';
      return '';
    }
    case 'agreeTerms':
      return !value ? 'You must agree to the Terms & Conditions.' : '';
    default:
      return '';
  }
}
