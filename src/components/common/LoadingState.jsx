
export default function LoadingState({ message = 'Loading...' }) {
  return (
    <p className="text-center py-4" role="status" aria-live="polite">
      {message}
    </p>
  )
}
