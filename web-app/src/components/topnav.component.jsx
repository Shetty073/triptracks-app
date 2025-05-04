import { Link } from "react-router";

export default function TopNav() {
  const handleSearch = () => {
    console.debug("Search button was clicked! 🔍")
  }

  return (
    <nav className="navbar navbar-expand px-4 py-3">
      <form action="#" className="d-none d-sm-inline-block">
        <div className="input-group input-group-navbar">
          <input type="text" name="search" id="search" className="form-control border-0 rounded-0 pe-0"
            placeholder="Search..." aria-label="Search" />
          <button className="btn border-0 rounded-0" type="button" onClick={handleSearch}>
            <i className='bx bx-search'></i>
          </button>
        </div>
      </form>

      <div className="navbar-collapse collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown">
            <a href="#" data-bs-toggle="dropdown" className="nav-icon pe-md-0">
              <img src="https://i.pravatar.cc/200" className="avatar img-fluid" alt="" />
            </a>
            <div className="dropdown-menu dropdown-menu-end rounded-0 border-0 shadow mt-3">
              <Link to="/dashboard/forms" className="dropdown-item">
                <i className='bx bx-data'></i>
                <span>Analytics</span>
              </Link>

              <Link to="/dashboard/forms" className="dropdown-item">
                <i className='bx bx-cog'></i>
                <span>Setting</span>
              </Link>

              <div className="dropdown-divider"></div>

              <Link to="/dashboard/forms" className="dropdown-item">
                <i className='bx bx-help-circle'></i>
                <span>Help Center</span>
              </Link>
            </div>
          </li>
        </ul>
      </div>

    </nav>
  );
}