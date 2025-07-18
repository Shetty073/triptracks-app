import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import DashboardCard from "../../components/dashboardCard.component";
import DashboardTable from "../../components/dashboardTable.component";
import axiosClient from "../../utils/axiosClient";
import { ENDPOINTS } from "../../constants/urls";

export default function TripsPage() {
  const navigate = useNavigate();
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsData, setTripsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("planned");

  const cards = [
    {
      title: "Distance Travelled",
      value: "7,648 KM",
      badgeText: "+9.0%",
      description: "Since Last Year",
    },
    {
      title: "Fuel Consumed",
      value: "1121 Litres",
      badgeText: "+0.8%",
      description: "Since Last Year",
    },
    {
      title: "Locations Visited",
      value: "18",
      badgeText: "+5.1%",
      description: "Since Last Year",
    },
  ];

  const pastTripsColumns = ["#", "Product", "Quantity", "Cost"];
  const pastTripsData = [
    ["ORD_1", "AMD CPU", "1", "₹ 23,456"],
    ["ORD_2", "Nvidia GPU", "2", "₹ 61,899"],
    ["ORD_3", "HyperX RAM", "2", "₹ 7,399"],
  ];

  const fetchTrips = async (page = 1) => {
    setTripsLoading(true);
    try {
      const response = await axiosClient.get(`${ENDPOINTS.GET_ALL_PLANNED_TRIPS}?page=${page}`);
      if (response.status === 200 && response.data.success) {
        const results = response.data.data.results || [];
        const transformedData = results.map((trip) => ({
          id: trip.id,
          origin_location: trip.origin_location,
          destination_location: trip.destination_location,
          distance: `${trip.distance} ${trip.distance_unit}`,
          updated_at: trip.updated_at,
        }));
        
        setTripsData(transformedData);
        
        // Calculate total pages from API response
        const totalCount = response.data.data.count;
        const itemsPerPage = 10; // Assuming 10 items per page, adjust if different
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setErrorMessage(response.data.message || "Unable to fetch trips data");
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setErrorMessage("Error fetching trips data");
    } finally {
      setTripsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTrips(page);
  };

  const handleViewTrip = (trip) => {
    navigate(`/dashboard/trips/detail?trip_id=${trip.id}`);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Trips Dashboard</h3>
          <Link to="/dashboard/trips/plan" className="btn btn-primary col-6 col-lg-2 mb-3">
            Plan a new trip
          </Link>
        </div>

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
            <ul className="nav nav-tabs" id="tripsTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "planned" ? "active" : ""}`}
                  onClick={() => setActiveTab("planned")}
                  type="button"
                  role="tab"
                >
                  Planned Trips
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "past" ? "active" : ""}`}
                  onClick={() => setActiveTab("past")}
                  type="button"
                  role="tab"
                >
                  Past Trips
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            <div className="tab-content" id="tripsTabContent">
              {/* Planned Trips Tab */}
              <div
                className={`tab-pane fade ${activeTab === "planned" ? "show active" : ""}`}
                role="tabpanel"
              >
                {tripsLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-grow text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <DashboardTable
                    title="Planned Trips"
                    data={tripsData}
                    renameColumns={{
                      'origin_location': 'Origin',
                      'destination_location': 'Destination',
                      'distance': 'Distance',
                      'updated_at': 'Updated On'
                    }}
                    omitColumns={['id']}
                    dateColumns={["updated_at"]}
                    actions={[
                      {
                        label: "View",
                        style: "primary",
                        icon: "bx bx-show",
                        onClick: handleViewTrip,
                        tooltip: "View trip details",
                        tooltipPosition: "top"
                      }
                    ]}
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>

              {/* Past Trips Tab */}
              <div
                className={`tab-pane fade ${activeTab === "past" ? "show active" : ""}`}
                role="tabpanel"
              >
                <DashboardTable 
                  title="Past Trips" 
                  columns={pastTripsColumns} 
                  data={pastTripsData} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
