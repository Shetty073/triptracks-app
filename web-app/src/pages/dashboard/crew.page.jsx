import { Link } from "react-router";
import DashboardTable from "../../components/dashboardTable.component";

export default function CrewPage() {
  const userColumns = ["#", "First", "Last", "Handle"];
  const userData = [
    ["1", "Mark", "Otto", "@mdo"],
    ["2", "Jacob", "Thornton", "@fat"],
    ["3", ["Larry the Bird", 2], "@twitter"],
  ];

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Crew Dashboard</h3>
          <Link to="/dashboard/crew/add" className="btn btn-primary col-6 col-lg-2 mb-3">Add a new crew</Link>
        </div>

        {/* Table & Chart */}
        <div className="row">
          <div className="col-12">
            <DashboardTable title="My Crew" columns={userColumns} data={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}
