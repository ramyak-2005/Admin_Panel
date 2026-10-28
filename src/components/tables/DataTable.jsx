
export default function DataTable({
  columns = [],
  data = [],
  rowKey = 'id',
  emptyMessage = 'No records found.',
}) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            {columns.map(({ key, label }) => (
              <th key={key} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length || 1} className="text-center py-4">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item[rowKey]}>
                {columns.map(({ key, render }) => (
                  <td key={key}>
                    {render ? render(item) : item[key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
