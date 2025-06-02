export default function DashboardTable({ title, columns, data, actions = [], eachRowHasLastItemAsId = false }) {
  const showActions = actions.length > 0;

  return (
    <div className="table-responsive">
      <h3 className="fw-bold fs-4 my-3 text-capitalize">{title}</h3>
      <table className="table table-striped">
        <thead>
          <tr className="highlight">
            {columns.map((col, idx) => (
              <th className="text-capitalize" scope="col" key={idx}>{col.replaceAll("_", " ")}</th>
            ))}
            {showActions && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => {
                // If eachRowHasLastItemAsId is set to true then the last column item in the row must be the unqique id representing the row hence we will skip the column from rendering
                if (eachRowHasLastItemAsId && (row.length !== (cellIdx + 1))) {
                  return (<td key={cellIdx} colSpan={Array.isArray(cell) ? cell[1] : 1}>
                    {Array.isArray(cell) ? cell[0] : cell}
                  </td>);
                }
              })}
              {showActions && (
                <td>
                  {actions.map((action, actionIdx) => (
                    <button
                      key={actionIdx}
                      className={`btn btn-${action.style || "primary"} btn-sm me-2`}
                      onClick={() => action.onClick(row)}
                    >
                      {action.icon ? <i className={action.icon}></i> : <span>{action.label}</span>}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
