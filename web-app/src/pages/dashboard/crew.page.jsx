import { useEffect, useState } from "react";
import { Link } from "react-router";
import DashboardTable from "../../components/dashboardTable.component";
import axiosClient from "../../utils/axiosClient";
import { ENDPOINTS } from "../../constants/urls";

export default function CrewPage() {
  const [crewLoading, setCrewLoading] = useState(false);
  const [crewRequestLoading, setCrewRequestLoading] = useState(false);
  const [crewData, setCrewData] = useState([]);
  const [crewRequestData, setCrewRequestData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchCrewMembers = async (page = 1) => {
    setCrewLoading(true);
    try {
      const response = await axiosClient.get(`${ENDPOINTS.FETCH_CREW_MEMBERS_FOR_CURRENT_USER}?page=${page}`);
      if (response.status === 200) {
        const results = response.data.data.results || [];
        const transformedData = results.map(({ requested_user, created_at }) => ({
          id: requested_user.id,
          username: requested_user.username,
          name: `${requested_user.first_name} ${requested_user.last_name}`,
          email: requested_user.email,
          requested_at: created_at,
        }));
        setCrewData(transformedData);
      } else {
        setErrorMessage(response.data.message || "Unable to fetch crew data");
      }
    } catch (err) {
      setErrorMessage("Error fetching crew data");
    } finally {
      setCrewLoading(false);
    }
  };

  const fetchCrewRequests = async () => {
    setCrewRequestLoading(true);
    try {
      const response = await axiosClient.get(ENDPOINTS.FETCH_CREW_REQUESTS);
      if (response.status === 200) {
        const results = response.data.data.results || [];
        const transformedData = results.map(({ from_user, created_at, accepted, id }) => ({
          id,
          username: from_user.username,
          name: `${from_user.first_name} ${from_user.last_name}`,
          email: from_user.email,
          requested_on: created_at,
          status: accepted ? "Accepted" : "Pending",
        }));
        setCrewRequestData(transformedData);
      } else {
        setErrorMessage(response.data.message || "Unable to fetch crew requests");
      }
    } catch (err) {
      setErrorMessage("Error fetching crew requests");
    } finally {
      setCrewRequestLoading(false);
    }
  };

  const acceptRejectCrewRequest = async (id, accept) => {
    try {
      const response = await axiosClient.patch(`${ENDPOINTS.ACCEPT_REJECT_CREW_REQUESTS}${id}/`, { accept });
      if (response.status === 202) {
        setSuccessMessage(response.data.message || "Crew request processed");
        fetchAllData();
      } else {
        setErrorMessage(response.data.message || "Unable to process crew request");
      }
    } catch {
      setErrorMessage("Error processing crew request");
    }
  };

  const removeUserFromCrew = async (id) => {
    try {
      const response = await axiosClient.delete(`${ENDPOINTS.REMOVE_USER_FROM_CREW}${id}/`);
      if (response.status === 202) {
        setSuccessMessage(response.data.message || "User removed from crew");
        fetchAllData();
      } else {
        setErrorMessage(response.data.message || "Unable to remove user");
      }
    } catch {
      setErrorMessage("Error removing user");
    }
  };

  const fetchAllData = () => {
    setCrewData([]);
    setCrewRequestData([]);
    setSuccessMessage("");
    setErrorMessage("");
    fetchCrewMembers();
    fetchCrewRequests();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Crew Dashboard</h3>
          <Link to="/dashboard/crew/add" className="btn btn-primary col-6 col-lg-2 mb-3">Add a new crew</Link>
        </div>

        {(successMessage || errorMessage) && (
          <div className="row">
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* My Crew Table */}
        <div className="row">
          <div className="col-12">
            {crewLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-grow text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (crewData.length > 0) &&
            <DashboardTable
              title="My Crew"
              data={crewData}
              renameColumns={{ 'requested_at': "Added On" }}
              omitColumns={['id']}
              dateColumns={["requested_at"]}
              actions={[
                {
                  label: "Remove",
                  style: "danger",
                  icon: "bx bx-list-minus",
                  onClick: (row) => removeUserFromCrew(row.id)
                }
              ]}
            />
            }
          </div>
        </div>

        {/* Crew Requests Table */}
        <div className="row">
          <div className="col-12">
            {crewRequestLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-grow text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (crewRequestData.length > 0) && <DashboardTable
              title="New Crew Requests"
              data={crewRequestData}
              dateColumns={["requested_on"]}
              actions={[
                {
                  label: "Accept",
                  style: "success",
                  icon: "bx bx-check",
                  onClick: (row) => acceptRejectCrewRequest(row.id, true),
                  tooltip: "Accept the crew request",
                  tooltipPosition: "bottom"
                },
                {
                  label: "Reject",
                  style: "danger",
                  icon: "bx bx-x",
                  onClick: (row) => acceptRejectCrewRequest(row.id, false),
                  tooltip: "Reject the crew request",
                  tooltipPosition: "bottom"
                }
              ]}
            />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
