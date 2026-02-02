import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: { label: string; value: string }[];
  defaultValue?: string;
}

interface AdminFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  defaultValues?: Record<string, any>;
}

const AdminForm: React.FC<AdminFormProps> = ({
  fields,
  onSubmit,
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  defaultValues = {}
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(
    defaultValues || fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateField = (field: FormField, value: any) => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    if (field.validation) {
      return field.validation(value);
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const field = fields.find((f) => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error || ''
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const field = fields.find((f) => f.name === name);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
      setTouched((prev) => ({ ...prev, [field.name]: true }));
    });

    setErrors(newErrors);

    if (isValid) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const isError = isTouched && error;
    const isValid = isTouched && !error && value;

    const baseInputClasses = `w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none text-base ${
      isError
        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:bg-white'
        : isValid
        ? 'border-green-300 bg-green-50 focus:border-green-500 focus:bg-white'
        : 'border-gray-200 bg-white focus:border-blue-500 hover:border-gray-300'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            className={baseInputClasses}
          />
        );
      case 'select':
        return (
          <select
            name={field.name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${baseInputClasses} cursor-pointer appearance-none`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <div className="relative">
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              className={baseInputClasses}
            />
            {isValid && field.type !== 'password' && (
              <CheckCircle size={20} className="absolute right-3 top-3 text-green-500" />
            )}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => {
        const error = errors[field.name];
        const isTouched = touched[field.name];
        const isError = isTouched && error;

        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {isError && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex gap-3 pt-8 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;
