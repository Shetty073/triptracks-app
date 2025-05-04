export default function DashboardCard({ title, value, badgeText, badgeType = "success", description }) {
  return (
    <div className="card shadow">
      <div className="card-body py-4">
        <h6 className="mb-2 fw-bold">{title}</h6>
        <p className="fw-bold">{value}</p>
        <div className="mb-0">
          <span className={`badge text-${badgeType} me-2`}>{badgeText}</span>
          <span className="fw-bold">{description}</span>
        </div>
      </div>
    </div>
  );
}