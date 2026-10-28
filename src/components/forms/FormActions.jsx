
export default function FormActions({
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  loading = false,
  disabled = false,
}) {
  return (
    <div className="form-actions">
      {onCancel && (
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </button>
      )}

      <button
        type="submit"
        className="primary-button"
        disabled={loading || disabled}
      >
        {loading ? 'Please wait...' : submitLabel}
      </button>
    </div>
  )
}
