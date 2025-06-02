import { Link } from "react-router";

export default function AddCrewPage(params) {
  return (
    <div className="container-fluid">
      <div className="mb-3">

        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Add a new crew</h3>
          <Link to="/dashboard/crew" className="btn btn-danger col-6 col-lg-2 mb-3">Cancel</Link>
        </div>

        <div className="row">
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">@</span>
          <input type="text" className="form-control" placeholder="Search users by username, email or phone number" aria-label="User search bar" aria-describedby="basic-addon1" />
        </div>
        </div>

      </div>
    </div>
  );
}