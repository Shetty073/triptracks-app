import { Link } from "react-router";

export default function AddVehiclePage(params) {
  return (
    <div className="container-fluid">
      <div className="mb-3">

        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-4">Add a new vehicle</h3>
          <Link to="/dashboard/vehicles" className="btn btn-danger col-2 mb-3">Cancel</Link>
        </div>

        <div className="row">
          Forms go here...
        </div>

      </div>
    </div>
  );
}