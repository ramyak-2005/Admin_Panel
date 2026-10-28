import { useEffect, useState } from 'react'

export function usePageSkeleton(delay = 350) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), delay)
    return () => window.clearTimeout(timeout)
  }, [delay])

  return loading
}

export default function PageSkeleton({ type = 'content' }) {
  return (
    <div className={`page-skeleton page-skeleton-${type}`} role="status" aria-label="Loading page">
      <span className="skeleton-line skeleton-heading" />
      <span className="skeleton-line skeleton-description" />
      {type === 'dashboard' && (
        <div className="skeleton-cards">
          {Array.from({ length: 5 }, (_, index) => <span className="skeleton-card" key={index} />)}
        </div>
      )}
      <div className="skeleton-panel">
        {type === 'table' && <div className="skeleton-toolbar" />}
        {Array.from({ length: type === 'table' ? 6 : 4 }, (_, index) => (
          <span className="skeleton-line skeleton-row" key={index} />
        ))}
      </div>
      <span className="sr-only">Loading content…</span>
    </div>
  )
}
