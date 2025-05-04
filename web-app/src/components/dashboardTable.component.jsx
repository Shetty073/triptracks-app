export default function DashboardTable({ title, columns, data }) {
  return (
    <div className="table-responsive">
      <h3 className="fw-bold fs-4 my-3 text-capitalize">{title}</h3>
      <table className="table table-striped">
        <thead>
          <tr className="highlight">
            {columns.map((col, idx) => (
              <th scope="col" key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} colSpan={Array.isArray(cell) ? cell[1] : 1}>{Array.isArray(cell) ? cell[0] : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}