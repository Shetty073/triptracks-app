import { useEffect, useState } from "react";
import { Link } from "react-router";
import DashboardTable from "../../components/dashboardTable.component";
import axiosClient from "../../utils/axiosClient";
import { formatDateToDDMMYYYY } from "../../utils/dateUtils";
import { ENDPOINTS } from "../../constants/urls";

export default function CrewPage() {
  const [crewLoading, setCrewLoading] = useState(false);
  const [crewRequestLoading, setCrewRequestLoading] = useState(false);
  const [crewData, setCrewData] = useState([]);
  const [crewRequestData, setCrewRequestData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const crewColumns = ["username", "name", "email", "reuqested_at"];
  const crewRequestDataColumns = ["username", "name", "email", "reuqested_at", "status"];

  const fetchCrewMembers = async () => {
    setCrewLoading(true);
    try {
      const response = await axiosClient.get(ENDPOINTS.FETCH_CREW_MEMBERS_FOR_CURRENT_USER);
      if (response.status === 200) {
        const results = response.data.data.results || [];
        const transformedData = results.map(({ requested_user, created_at }) => ([
          requested_user.username,
          `${requested_user.first_name} ${requested_user.last_name}`,
          requested_user.email,
          formatDateToDDMMYYYY(created_at),
          requested_user.id
        ]));
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
        const transformedData = results.map(({ from_user, created_at, accepted, id }) => ([
          from_user.username,
          `${from_user.first_name} ${from_user.last_name}`,
          from_user.email,
          formatDateToDDMMYYYY(created_at),
          accepted ? "Accepted" : "Pending",
          id
        ]));
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
            ) : (
              <DashboardTable
                title="My Crew"
                columns={crewColumns}
                data={crewData}
                actions={[
                  {
                    label: "Remove",
                    style: "danger",
                    icon: "bx bx-list-minus",
                    onClick: (row) => removeUserFromCrew(row[row.length - 1])
                  }
                ]}
                eachRowHasLastItemAsId={true}
              />
            )}
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
            ) : (
              <DashboardTable
                title="New Crew Requests"
                columns={crewRequestDataColumns}
                data={crewRequestData}
                actions={[
                  {
                    label: "Accept",
                    style: "success",
                    icon: "bx bx-check",
                    onClick: (row) => acceptRejectCrewRequest(row[row.length - 1], true)
                  },
                  {
                    label: "Reject",
                    style: "danger",
                    icon: "bx bx-x",
                    onClick: (row) => acceptRejectCrewRequest(row[row.length - 1], false)
                  }
                ]}
                eachRowHasLastItemAsId={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
