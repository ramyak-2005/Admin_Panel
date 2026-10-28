
export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) {
  return (
    <div className="text-center py-4" role="alert">
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="primary-button"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  )
}
