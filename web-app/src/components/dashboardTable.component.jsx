import { useMemo } from "react";
import { formatDateToDDMMYYYYWithTime12 } from "../utils/dateUtils";

export default function DashboardTable({
  title,
  data = [],
  columns,
  actions = [],
  page = 1,
  totalPages = 1,
  onPageChange = () => { },
  dateColumns = ["created_at", "updated_at"],
  omitColumns = ["id"],
  renameColumns = {}, // e.g. { created_at: "Requested On" }
  actionsColumnWidth = "120px"
}) {
  const showActions = actions.length > 0;
  const savedTheme = localStorage.getItem("theme");

  const derivedColumns = useMemo(() => {
    if (columns?.length > 0) {
      return columns.filter(col => !omitColumns.includes(col));
    }
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(col => !omitColumns.includes(col));
  }, [data, columns, omitColumns]);

  const formatCell = (col, value) => {
    if (dateColumns.includes(col) && value) {
      return formatDateToDDMMYYYYWithTime12(value);
    }
    return value;
  };

  const getColumnDisplayName = (col) => {
    return renameColumns[col] || col.replaceAll("_", " ");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="table-responsive">
      <h3 className="fw-bold fs-4 my-3 text-capitalize">{title}</h3>

      <table className={`${savedTheme === "dark" ? "table table-striped table-dark" : "table table-striped"}`}>
        <thead>
          <tr className="highlight">
            {derivedColumns.map((col, idx) => (
              <th className="text-capitalize" key={idx}>
                {getColumnDisplayName(col)}
              </th>
            ))}
            {showActions && (
              <th
                style={{
                  width: actionsColumnWidth,
                  minWidth: actionsColumnWidth,
                  maxWidth: actionsColumnWidth,
                  textAlign: "center"
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {derivedColumns.map((col, colIdx) => (
                <td key={colIdx}>{formatCell(col, row[col])}</td>
              ))}
              {showActions && (
                <td
                  style={{
                    width: actionsColumnWidth,
                    minWidth: actionsColumnWidth,
                    maxWidth: actionsColumnWidth,
                    textAlign: "center",
                    verticalAlign: "middle"
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center flex-wrap gap-1">
                    {actions.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        className={`btn btn-${action.style || "primary"} btn-sm`}
                        onClick={() => action.onClick(row)}
                      >
                        {action.icon ? <i className={action.icon}></i> : <span>{action.label}</span>}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-end">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pg => (
              <li className={`page-item ${pg === page ? "active" : ""}`} key={pg}>
                <button className="page-link" onClick={() => handlePageChange(pg)}>
                  {pg}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
