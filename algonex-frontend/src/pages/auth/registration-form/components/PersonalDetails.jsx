import FormField from './FormField';
import PhotoUpload from './PhotoUpload';

const PersonalDetails = ({
  formData,
  errors,
  onChange,
  photo,
  photoPreview,
  onPhotoChange,
  onRemovePhoto,
  shake,
}) => {
  return (
    <section className={`form-card glass-card${shake ? ' shake' : ''}`}>
      <div className="card-header">
        <div className="header-icon">
          <i className="fa-solid fa-user-astronaut"></i>
        </div>
        <h2>Section A: Personal Details</h2>
      </div>

      <PhotoUpload
        photo={photo}
        photoPreview={photoPreview}
        onPhotoChange={onPhotoChange}
        onRemovePhoto={onRemovePhoto}
        error={errors.photo}
      />

      <div className="form-grid">
        <FormField
          id="fullName"
          name="fullName"
          label="Full Name"
          icon="fa-solid fa-signature"
          value={formData.fullName}
          onChange={onChange}
          error={errors.fullName}
          required
          placeholder="e.g. Ganesh Pasala"
          autoComplete="name"
        />

        <FormField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          icon="fa-solid fa-envelope"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
          required
          placeholder="e.g. ganesh@example.com"
          autoComplete="email"
        />

        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          icon="fa-solid fa-lock"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
          required
          placeholder="Set a password (min 8 chars)"
          autoComplete="new-password"
        />

        <FormField
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          icon="fa-solid fa-phone"
          value={formData.phone}
          onChange={onChange}
          error={errors.phone}
          required
          placeholder="e.g. 9876543210"
          autoComplete="tel"
        />

        <FormField
          id="parentPhone"
          name="parentPhone"
          label="Parent/Guardian Contact"
          type="tel"
          icon="fa-solid fa-users"
          value={formData.parentPhone}
          onChange={onChange}
          error={errors.parentPhone}
          required
          placeholder="e.g. 9876543210"
        />

        <FormField
          id="dob"
          name="dob"
          label="Date of Birth"
          type="date"
          icon="fa-solid fa-calendar-days"
          value={formData.dob}
          onChange={onChange}
          error={errors.dob}
          required
        />

        <FormField
          id="gender"
          name="gender"
          label="Gender"
          type="select"
          icon="fa-solid fa-venus-mars"
          value={formData.gender}
          onChange={onChange}
          error={errors.gender}
          required
          options={[
            { value: '', label: 'Select Gender', disabled: true },
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
        />

        <FormField
          id="collegeName"
          name="collegeName"
          label="College Name"
          icon="fa-solid fa-building-columns"
          value={formData.collegeName}
          onChange={onChange}
          error={errors.collegeName}
          required
          placeholder="e.g. Algonex Institute of Tech"
        />

        <FormField
          id="branch"
          name="branch"
          label="Branch / Department"
          icon="fa-solid fa-gears"
          value={formData.branch}
          onChange={onChange}
          error={errors.branch}
          required
          placeholder="e.g. Computer Science"
        />

        <FormField
          id="currentYear"
          name="currentYear"
          label="Current Year"
          type="select"
          icon="fa-solid fa-graduation-cap"
          value={formData.currentYear}
          onChange={onChange}
          error={errors.currentYear}
          required
          options={[
            { value: '', label: 'Select Year', disabled: true },
            { value: '1st Year', label: '1st Year' },
            { value: '2nd Year', label: '2nd Year' },
            { value: '3rd Year', label: '3rd Year' },
            { value: '4th Year', label: '4th Year' },
            { value: 'Passed Out', label: 'Passed Out' },
          ]}
        />

        <FormField
          id="city"
          name="city"
          label="City"
          icon="fa-solid fa-city"
          value={formData.city}
          onChange={onChange}
          error={errors.city}
          required
          placeholder="e.g. Hyderabad"
        />

        <FormField
          id="state"
          name="state"
          label="State"
          icon="fa-solid fa-map-location-dot"
          value={formData.state}
          onChange={onChange}
          error={errors.state}
          required
          placeholder="e.g. Telangana"
        />
      </div>
    </section>
  );
};

export default PersonalDetails;
