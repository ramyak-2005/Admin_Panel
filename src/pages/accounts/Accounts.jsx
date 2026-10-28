
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { accounts } from '../../data/accounts'
import Pagination from '../../components/common/Pagination'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/tables/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import PageSkeleton, { usePageSkeleton } from '../../components/common/PageSkeleton'

const PAGE_SIZE = 5
const STATUSES = ['All', 'Active', 'Inactive', 'Suspended']

export default function Accounts() {
  const navigate = useNavigate()
  const loading = usePageSkeleton()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(
    STATUSES.includes(searchParams.get('filter'))
      ? searchParams.get('filter')
      : 'All',
  )
  const [currentPage, setCurrentPage] = useState(1)
  const selectedType = searchParams.get('filter') === 'Shopify' ? 'Shopify' : ''

  // Default sort: newest Created Date first (ISO dates sort chronologically).
  const filteredAccounts = accounts
    .filter((account) =>
      account.orgName.toLowerCase().includes(search.trim().toLowerCase()) &&
      (status === 'All' || account.status === status) &&
      (!selectedType || account.type === selectedType),
    )
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())

  const totalPages = Math.ceil(filteredAccounts.length / PAGE_SIZE)
  const safeCurrentPage = Math.max(1, Math.min(currentPage, Math.max(totalPages, 1)))
  const startIndex = filteredAccounts.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(safeCurrentPage * PAGE_SIZE, filteredAccounts.length)
  const paginatedAccounts = filteredAccounts.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  )

  const columns = [
    { key: 'createdDate', label: 'Created Date' },
    { key: 'orgName', label: 'Org Name' },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (account) => <StatusBadge status={account.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (account) => (
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate(`/accounts/${account.id}`)}
        >
          View
        </button>
      ),
    },
  ]

  function clearFilters() {
    setSearch('')
    setStatus('All')
    setCurrentPage(1)
    setSearchParams({})
  }

  if (loading) return <PageSkeleton type="table" />

  return (
    <div className="accounts-page">
      <PageHeader
        title="Accounts"
        description="Search and manage organisation accounts."
      />

      <section className="content-card">
        <div className="accounts-toolbar">
          <p>
            Total accounts: <strong>{filteredAccounts.length}</strong>
          </p>

          <div className="accounts-filters">
            <div className="filter-field">
              <label htmlFor="account-search">Search organisation</label>
              <input
                id="account-search"
                type="search"
                placeholder="Enter organisation name"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="account-status">Status</label>
              <select
                id="account-status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value)
                  setCurrentPage(1)
                  setSearchParams({})
                }}
              >
                {STATUSES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginatedAccounts}
          emptyMessage="No accounts found."
        />

        <div className="accounts-table-footer">
          <p className="accounts-result-count" aria-live="polite">
            Showing {startIndex}–{endIndex} of {filteredAccounts.length} accounts
          </p>
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  )
}
