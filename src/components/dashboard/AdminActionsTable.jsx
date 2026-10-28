
import { useState } from 'react'

const COLUMNS = [
  { key: 'timestamp', label: 'Date and time' },
  { key: 'actor', label: 'Admin / actor' },
  { key: 'action', label: 'Action' },
  { key: 'organisation', label: 'Organisation' },
  { key: 'details', label: 'Module / details' },
]

const PAGE_SIZE = 5

export default function AdminActionsTable({
  actions = [],
  loading = false,
  error = '',
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const message = loading
    ? 'Loading admin actions...'
    : error ||
      (!actions.length
        ? 'No admin actions found for this date range.'
        : '')

  return (
    <div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              {COLUMNS.map(({ key, label }) => (
                <th key={key} scope="col">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {message ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="text-center py-4"
                  role={error ? 'alert' : 'status'}
                >
                  {message}
                </td>
              </tr>
            ) : (
              actions.slice(0, visibleCount).map((item) => (
                <tr key={item.id}>
                  {COLUMNS.map(({ key }) => (
                    <td key={key}>{item[key] ?? '—'}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && visibleCount < actions.length && (
        <div className="text-center mt-3">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
