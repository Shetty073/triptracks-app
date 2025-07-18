import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6 text-center">
          <div className="error-page">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="h3 mb-3">Page Not Found</h2>
            <p className="lead mb-4">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/dashboard/trips" className="btn btn-primary">
                <i className="bx bx-arrow-back me-2"></i>Back to Dashboard
              </Link>
              <Link to="/dashboard" className="btn btn-outline-primary">
                <i className="bx bx-home me-2"></i>Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
