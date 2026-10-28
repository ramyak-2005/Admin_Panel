import PageHeader from '../../components/common/PageHeader'
import PageSkeleton, { usePageSkeleton } from '../../components/common/PageSkeleton'

export default function Settings() {
  const loading = usePageSkeleton()

  if (loading) return <PageSkeleton type="content" />

  return (
    <div className="settings-page">
      <PageHeader
        title="Settings"
        description="Manage Admin Portal settings."
      />
      <section className="content-card">
        <p className="settings-placeholder">
          Settings functionality will be available in a future update.
        </p>
      </section>
    </div>
  )
}