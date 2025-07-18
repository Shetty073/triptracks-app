import { useState, useEffect } from "react";
import { Link } from "react-router";
import DashboardCard from "../../components/dashboardCard.component";
import DashboardTable from "../../components/dashboardTable.component";
import axiosClient from "../../utils/axiosClient";
import { ENDPOINTS } from "../../constants/urls";
import { getTotalPagesCount } from "../../utils/pageUtils";

export default function VehiclesPage() {
  const [userVehicles, setUserVehicles] = useState([]);
  const [userVehicleCount, setUserVehicleCount] = useState(0);
  const [userPage, setUserPage] = useState(1);

  const [crewVehicles, setCrewVehicles] = useState([]);
  const [crewVehicleCount, setCrewVehicleCount] = useState(0);
  const [crewPage, setCrewPage] = useState(1);

  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [crewVehiclesLoading, setCrewVehiclesLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState("my-vehicles");

  const cards = [
    { title: "Fuel Consumed", value: "1121 Litres", badgeText: "+0.8%", description: "Since Last Year" },
    { title: "Fuel Cost", value: "₹ 1,34,564", badgeText: "+5.1%", description: "Since Last Year" },
    { title: "Highest Fuel Average", value: "17.45 KM/L", badgeText: "", description: "Vehicle: Tata Nexon" },
  ];

  const getUserVehicles = async (page = 1) => {
    try {
      const response = await axiosClient.get(`${ENDPOINTS.GET_USER_VEHICLES}?page=${page}`);
      const resData = response.data?.data;

      if (response.status === 200 && Array.isArray(resData?.results)) {
        setUserVehicles(resData.results);
        setUserVehicleCount(resData.count || 0);
        setUserPage(page);
        console.log({userVehicles, vehiclesLoading});
      } else {
        setErrorMessage(response.data?.message || 'Unable to fetch user vehicle details');
      }
    } catch {
      setErrorMessage('Unable to fetch user vehicle details');
    }
    setVehiclesLoading(false);
  };

  const getCrewVehicles = async (page = 1) => {
    try {
      const response = await axiosClient.get(`${ENDPOINTS.GET_USER_CREW_VEHICLES}?page=${page}`);
      const resData = response.data?.data;

      if (response.status === 200 && Array.isArray(resData?.results)) {
        setCrewVehicles(resData.results);
        setCrewVehicleCount(resData.count || 0);
        setCrewPage(page);
      } else {
        setErrorMessage(response.data?.message || 'Unable to fetch crew vehicle details');
      }
    } catch {
      setErrorMessage('Unable to fetch crew vehicle details');
    }
    setCrewVehiclesLoading(false);
  };

  const removeUserVehicle = async (id) => {
    setVehiclesLoading(true);
    try {
      const response = await axiosClient.delete(`${ENDPOINTS.REMOVE_USER_VEHICLE}${id}/`);
      const resData = response.data;

      if (response.status === 201 && resData?.success === true) {
        setSuccessMessage(resData?.message || 'Vehicle deleted successfully');
        
        let pageToLoad = (userVehicles.length > 1) ? userPage : ((userPage > 1) ? userPage - 1 : userPage);

        getUserVehicles(pageToLoad);
      } else {
        setErrorMessage(response.data?.message || 'Unable to remove user vehicle');
      }
    } catch {
      setErrorMessage('Unable to remove user vehicle due to some error');
    }
    setVehiclesLoading(false);
  };

  useEffect(() => {
    getUserVehicles();
    getCrewVehicles();
  }, []);

  const userTotalPages = getTotalPagesCount(userVehicleCount);
  const crewTotalPages = getTotalPagesCount(crewVehicleCount);

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Vehicles Dashboard</h3>
          <Link to="/dashboard/vehicles/add" className="btn btn-primary col-6 col-lg-2 mb-3">Add a new vehicle</Link>
        </div>

        {/* Alert Messages */}
        {successMessage && (
          <div className="row">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccessMessage("")}
              ></button>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="row">
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMessage}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setErrorMessage("")}
              ></button>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="row">
          {cards.map((card, idx) => (
            <div className="col-12 col-md-4" key={idx}>
              <DashboardCard {...card} />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="row">
          <div className="col-12">
            <ul className="nav nav-tabs" id="vehiclesTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "my-vehicles" ? "active" : ""}`}
                  onClick={() => setActiveTab("my-vehicles")}
                  type="button"
                  role="tab"
                >
                  My Vehicles
                  {userVehicleCount > 0 && (
                    <span className="badge bg-secondary ms-2">{userVehicleCount}</span>
                  )}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "crew-vehicles" ? "active" : ""}`}
                  onClick={() => setActiveTab("crew-vehicles")}
                  type="button"
                  role="tab"
                >
                  Crew Vehicles
                  {crewVehicleCount > 0 && (
                    <span className="badge bg-secondary ms-2">{crewVehicleCount}</span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            <div className="tab-content" id="vehiclesTabContent">
              {/* My Vehicles Tab */}
              <div
                className={`tab-pane fade ${activeTab === "my-vehicles" ? "show active" : ""}`}
                role="tabpanel"
              >
                {vehiclesLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-grow text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (userVehicles.length > 0) ? (
                  <DashboardTable
                    title="My Vehicles"
                    data={userVehicles}
                    omitColumns={['updated_at', 'id']}
                    renameColumns={{'created_at': "Added On"}}
                    page={userPage}
                    totalPages={userTotalPages}
                    onPageChange={getUserVehicles}
                    actions={[
                      {
                        label: "Remove",
                        style: "danger",
                        icon: "bx bx-list-minus",
                        onClick: (row) => removeUserVehicle(row.id),
                        tooltip: "Remove this vehicle",
                        tooltipPosition: "top"
                      }
                    ]}
                  />
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="bx bx-car display-1 text-muted"></i>
                    </div>
                    <h5 className="text-muted">No vehicles found</h5>
                    <p className="text-muted">You haven't added any vehicles yet.</p>
                    <Link to="/dashboard/vehicles/add" className="btn btn-primary">
                      Add Your First Vehicle
                    </Link>
                  </div>
                )}
              </div>

              {/* Crew Vehicles Tab */}
              <div
                className={`tab-pane fade ${activeTab === "crew-vehicles" ? "show active" : ""}`}
                role="tabpanel"
              >
                {crewVehiclesLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-grow text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (crewVehicles.length > 0) ? (
                  <DashboardTable
                    title="Crew Vehicles"
                    data={crewVehicles}
                    omitColumns={['updated_at', 'id']}
                    renameColumns={{'created_at': "Added On"}}
                    page={crewPage}
                    totalPages={crewTotalPages}
                    onPageChange={getCrewVehicles}
                  />
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="bx bx-group display-1 text-muted"></i>
                    </div>
                    <h5 className="text-muted">No crew vehicles found</h5>
                    <p className="text-muted">Your crew members haven't added any vehicles yet.</p>
                    <Link to="/dashboard/crew" className="btn btn-outline-primary">
                      Manage Crew Members
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
