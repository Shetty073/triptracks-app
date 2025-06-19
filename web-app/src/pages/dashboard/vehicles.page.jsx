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
      } else {
        setErrorMessage(resData?.message || 'No results found.');
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
        setErrorMessage(resData?.message || 'No results found.');
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
        setErrorMessage(resData?.message || 'No results found.');
      }
    } catch {
      setErrorMessage('Unable to fetch user vehicle details');
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

        <div className="row">
          {cards.map((card, idx) => (
            <div className="col-12 col-md-4" key={idx}>
              <DashboardCard {...card} />
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-12">
            {vehiclesLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-grow text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (crewVehicles.length > 0) &&
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
                  onClick: (row) => removeUserVehicle(row.id)
                }
              ]}
            />
            }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {crewVehiclesLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-grow text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (crewVehicles.length > 0) &&
            <DashboardTable
              title="Crew Vehicles"
              data={crewVehicles}
              omitColumns={['updated_at', 'id']}
              renameColumns={{'created_at': "Added On"}}
              page={crewPage}
              totalPages={crewTotalPages}
              onPageChange={getCrewVehicles}
            />
            }
          </div>
        </div>

        {successMessage && <div className="alert alert-success alert-dismissible fade show">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger alert-dismissible fade show">{errorMessage}</div>}
      </div>
    </div>
  );
}
