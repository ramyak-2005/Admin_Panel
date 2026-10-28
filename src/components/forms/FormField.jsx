
export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  autoComplete,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required && ' *'}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
