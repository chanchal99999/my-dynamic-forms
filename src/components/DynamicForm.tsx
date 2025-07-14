// src/components/DynamicForm.tsx

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';

// Re-defining interfaces here for self-containment, but ideally from a types.ts file
interface FormField {
  id: string; label: string; type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
  options?: { value: string; label: string }[]; required?: boolean; defaultValue?: any;
}

interface SubmitFormApiResponse {
  success: boolean; message: string; submittedData: Record<string, any>;
}

interface DynamicFormProps {
  formFields: FormField[];
  onFormSubmit: (data: Record<string, any>) => Promise<SubmitFormApiResponse>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formFields, onFormSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResponse, setSubmitResponse] = useState<SubmitFormApiResponse | null>(null);

  // Initialize form data when formFields change (i.e., new item selected)
  useEffect(() => {
    const initialData: Record<string, any> = {};
    formFields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        initialData[field.id] = false;
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
    setSubmitError(null);
    setSubmitResponse(null); // Clear previous submission response
  }, [formFields]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSubmitError(null);
    setSubmitResponse(null);

    // Basic client-side validation
    for (const field of formFields) {
      if (field.required && !formData[field.id]) {
        setSubmitError(`Please fill in the required field: "${field.label}"`);
        setLoadingSubmit(false);
        return;
      }
      // Simple email validation
      if (field.type === 'email' && formData[field.id] && !/\S+@\S+\.\S+/.test(formData[field.id])) {
        setSubmitError(`Please enter a valid email address for "${field.label}"`);
        setLoadingSubmit(false);
        return;
      }
    }

    try {
      const response = await onFormSubmit(formData); // Call the prop function
      if (response.success) {
        setSubmitResponse(response);
      } else {
        setSubmitError(response.message);
      }
    } catch (error: any) {
      setSubmitError(`Submission failed: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <div key={field.id} className="form-group">
            <label htmlFor={field.id}>{field.label}{field.required && <span className="required">*</span>}:</label>
            <input
              type={field.type}
              id={field.id}
              value={formData[field.id] || ''}
              onChange={handleChange}
              required={field.required}
              className="form-input"
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id} className="form-group">
            <label htmlFor={field.id}>{field.label}{field.required && <span className="required">*</span>}:</label>
            <textarea
              id={field.id}
              value={formData[field.id] || ''}
              onChange={handleChange}
              rows={4}
              required={field.required}
              className="form-input"
            ></textarea>
          </div>
        );
      case 'select':
        return (
          <div key={field.id} className="form-group">
            <label htmlFor={field.id}>{field.label}{field.required && <span className="required">*</span>}:</label>
            <select
              id={field.id}
              value={formData[field.id] || ''}
              onChange={handleChange}
              required={field.required}
              className="form-input"
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="form-group form-group-checkbox">
            <input
              type="checkbox"
              id={field.id}
              checked={formData[field.id] || false}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor={field.id}>{field.label}</label>
          </div>
        );
      default:
        return <p key={field.id} style={{ color: 'orange' }}>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {formFields.map(renderFormField)}
        <button type="submit" disabled={loadingSubmit} className="submit-button">
          {loadingSubmit ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {submitError && <p className="error-message">{submitError}</p>}

      {submitResponse && (
        <div className="response-message">
          <h3>{submitResponse.message}</h3>
          <pre>
            {JSON.stringify(submitResponse.submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;