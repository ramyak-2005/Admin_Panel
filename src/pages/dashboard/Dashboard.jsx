
import { useState } from 'react'
import { accounts } from '../../data/accounts'
import SummaryCard from '../../components/dashboard/SummaryCard'
import AdminActionsTable from '../../components/dashboard/AdminActionsTable'
import { useNavigate } from 'react-router-dom'
import PageSkeleton, { usePageSkeleton } from '../../components/common/PageSkeleton'
import PageHeader from '../../components/common/PageHeader'
const SUMMARY_ITEMS = [
  { title: 'Total Accounts', count: (data) => data.length, filter: '' },
  { title: 'Suspended', count: (data) => data.filter((a) => a.status === 'Suspended').length, filter: 'Suspended' },
  { title: 'Shopify', count: (data) => data.filter((a) => a.type === 'Shopify').length, filter: 'Shopify' },
  { title: 'Active', count: (data) => data.filter((a) => a.status === 'Active').length, filter: 'Active' },
  { title: 'Inactive', count: (data) => data.filter((a) => a.status === 'Inactive').length, filter: 'Inactive' },
]

const SAMPLE_ACTIONS = [
  { id: '1', timestamp: '2026-10-24 09:30', actor: 'Admin', action: 'Viewed account', organisation: 'ABC Technologies', details: 'Account overview' },
  { id: '2', timestamp: '2026-10-23 14:15', actor: 'Admin', action: 'Updated account', organisation: 'XYZ Solutions', details: 'Organisation profile' },
  { id: '3', timestamp: '2026-10-22 11:00', actor: 'Admin', action: 'Viewed account', organisation: 'Demo Organisation', details: 'Account overview' },
 { id: '4', timestamp:'2026-10-21 12:30' , actor:  'Admin', action: 'updated account', organisation: 'Green Technosolution' , details:'Organisation profile'}
]
export default function Dashboard() {
  const navigate = useNavigate()
  const loading = usePageSkeleton()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [appliedDates, setAppliedDates] = useState(['', ''])

  const actions = SAMPLE_ACTIONS.filter(({ timestamp }) => {
    const date = timestamp.slice(0, 10)
    return (!appliedDates[0] || date >= appliedDates[0]) &&
      (!appliedDates[1] || date <= appliedDates[1])
  })

  function handleApply(event) {
    event.preventDefault()
    setAppliedDates([dateFrom, dateTo])
  }

  function handleClear() {
    setDateFrom('')
    setDateTo('')
    setAppliedDates(['', ''])
  }

  if (loading) return <PageSkeleton type="dashboard" />

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard"
        description="Overview of accounts and recent admin activity."
      />

      <section className="summary-grid" aria-label="Account summary">
  {SUMMARY_ITEMS.map(({ title, filter, count }) => (
    <SummaryCard
      key={title}
      title={title}
      value={count(accounts)}
      onClick={() =>
        navigate(filter ? `/accounts?filter=${filter}` : '/accounts')
      }
    />
  ))}
</section>

      <section className="content-card" aria-labelledby="admin-actions-heading">
        <header className="section-heading">
          <h3 id="admin-actions-heading">Recent Admin Actions</h3>
          <p>Review administrative activity by date.</p>
        </header>

        <form className="date-filters" onSubmit={handleApply}>
          <div className="filter-field">
            <label htmlFor="date-from">From date</label>
            <input id="date-from" type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="filter-field">
            <label htmlFor="date-to">To date</label>
            <input id="date-to" type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <button type="submit" className="primary-button">Apply</button>
          <button type="button" className="secondary-button" onClick={handleClear}>Clear</button>
        </form>

        <AdminActionsTable actions={actions} />
      </section>
    </div>
  )
}
