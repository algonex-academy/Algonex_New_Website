import FormField from './FormField';

const TrainingDetails = ({ formData, errors, onChange, shake, courseOptions }) => {
  return (
    <section className={`form-card glass-card${shake ? ' shake' : ''}`}>
      <div className="card-header">
        <div className="header-icon">
          <i className="fa-solid fa-rocket"></i>
        </div>
        <h2>Section B: Training Details</h2>
      </div>

      <div className="form-grid">
        <FormField
          id="courseSelected"
          name="courseSelected"
          label="Course Selected"
          type="select"
          icon="fa-solid fa-laptop-code"
          value={formData.courseSelected}
          onChange={onChange}
          error={errors.courseSelected}
          required
          options={courseOptions || [
            { value: '', label: 'Select Course', disabled: true },
            { value: 'Others', label: 'Others' },
          ]}
        />

        {formData.courseSelected === 'Others' && (
          <FormField
            id="otherCourse"
            name="otherCourse"
            label="Specify Course Name"
            icon="fa-solid fa-pen-clip"
            value={formData.otherCourse || ''}
            onChange={onChange}
            error={errors.otherCourse}
            required
            placeholder="e.g. Cyber Security"
          />
        )}

        <FormField
          id="batchType"
          name="batchType"
          label="Batch Type"
          type="select"
          icon="fa-solid fa-people-group"
          value={formData.batchType}
          onChange={onChange}
          error={errors.batchType}
          required
          options={[
            { value: '', label: 'Select Batch Type', disabled: true },
            { value: 'Training', label: 'Training' },
            { value: 'Internship', label: 'Internship' },
            { value: 'Fellowship', label: 'Fellowship' },
            { value: 'Job Support', label: 'Job Support' },
          ]}
        />

        <FormField
          id="joiningDate"
          name="joiningDate"
          label="Joining Date"
          type="date"
          icon="fa-solid fa-calendar-check"
          value={formData.joiningDate}
          onChange={onChange}
          error={errors.joiningDate}
          required
        />

        <FormField
          id="totalFee"
          name="totalFee"
          label="Total Course Fee (₹)"
          type="number"
          min="0"
          icon="fa-solid fa-indian-rupee-sign"
          value={formData.totalFee}
          onChange={onChange}
          error={errors.totalFee}
          required
          placeholder="e.g. 20000"
          onKeyDown={(e) => {
            if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
              e.preventDefault();
            }
          }}
          onWheel={(e) => e.target.blur()}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <FormField
            id="whyJoinAlgonex"
            name="whyJoinAlgonex"
            label="Why do you want to join Algonex?"
            type="textarea"
            icon="fa-solid fa-circle-question"
            value={formData.whyJoinAlgonex}
            onChange={onChange}
            error={errors.whyJoinAlgonex}
            placeholder="Tell us why you want to enroll in this program (Optional)"
          />
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={onChange}
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#0ea5e9',
                marginTop: '3px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'underline', fontWeight: 600 }}>Terms and Conditions</a> and verify that all information provided is accurate and correct. <span style={{ color: '#f43f5e' }}>*</span>
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="error-msg visible" style={{ display: 'block', marginTop: '6px', color: '#f43f5e', fontSize: '12px' }}>
              {errors.agreeTerms}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrainingDetails;
