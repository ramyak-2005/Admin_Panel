
export default function EmptyState({ message = 'No records found.' }) {
  return (
    <p className="text-center py-4" role="status">
      {message}
    </p>
  )
}
