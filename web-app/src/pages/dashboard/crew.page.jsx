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

  const crewRequestDataColumns = ["crew_request_id", "username", "name", "email", "reuqested_at", "status"];

  const fetchCrewMembers = async () => {
    setCrewLoading(true);
    const response = await axiosClient.get(ENDPOINTS.FETCH_CREW_MEMBERS_FOR_CURRENT_USER);
    if (response.status === 200) {
      let results = response.data.data.results;
      let crewData = [];
      if (results) {
        results.forEach(element => {
          crewData.push([
            element.requested_user.username, 
            `${element.requested_user.first_name} ${element.requested_user.last_name}`, 
            element.requested_user.email, 
            formatDateToDDMMYYYY(element.created_at)
          ]);
        });
      }
      
      setCrewData(crewData);
    } else {
      let errorMessage = response.data.message | "Unable to fetch crew data";
      setErrorMessage(errorMessage);
    }
    setCrewLoading(false);
  };

  const fetchCrewRequests = async () => {
    setCrewRequestLoading(true);
    const response = await axiosClient.get(ENDPOINTS.FETCH_CREW_REQUESTS);
    if (response.status === 200) {
      let results = response.data.data.results;
      let crewRequests = [];
      if (results) {
        results.forEach(element => {
          crewRequests.push([
            element.id, 
            element.from_user.username, 
            `${element.from_user.first_name} ${element.from_user.last_name}`, 
            element.from_user.email, 
            formatDateToDDMMYYYY(element.created_at),
            element.accepted ? "Accepted" : "Pending",
          ]);
        });
      }
      
      setCrewRequestData(crewRequests);
    } else {
      let errorMessage = response.data.message | "Unable to fetch crew requests";
      setErrorMessage(errorMessage);
    }
    setCrewRequestLoading(false);
  };

  const acceptRejectCrewRequest = async (id, accept) => {
    const response = await axiosClient.patch(`${ENDPOINTS.ACCEPT_REJECT_CREW_REQUESTS}${id}/`, {
      "accept": accept
    });
    if (response.status === 202) {
      let errorMessage = response.data.message | "Crew request accepted successfully";
      setSuccessMessage(errorMessage);
      
    } else {
      let errorMessage = response.data.message | "Unable to process crew requests";
      setErrorMessage(errorMessage);
    }
  };

  useEffect(() => {
    fetchCrewMembers();
    fetchCrewRequests();
  }, []);

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Crew Dashboard</h3>
          <Link to="/dashboard/crew/add" className="btn btn-primary col-6 col-lg-2 mb-3">Add a new crew</Link>
        </div>

        <div className="row">
          {(successMessage && !crewRequestLoading && !crewLoading) && 
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>}

          {(errorMessage && !crewRequestLoading && !crewLoading) && 
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>}
        </div>

        {/* Table & Chart */}
        <div className="row">
          <div className="col-12">
            {crewLoading ?
            <div className="d-flex justify-content-center">
              <div className="spinner-grow text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>:
            <DashboardTable
              title="My Crew"
              columns={crewColumns}
              data={crewData}
            />}

          </div>
        </div>

        {/* Table & Chart */}
        <div className="row">
          <div className="col-12">
            {crewRequestLoading ?
            <div className="d-flex justify-content-center">
              <div className="spinner-grow text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>:
            <DashboardTable
              title="New Crew Requests"
              columns={crewRequestDataColumns}
              data={crewRequestData}
              actions={[
                {
                  label: "Accept",
                  style: "success",
                  icon: "bx bx-check",
                  onClick: (row) => {
                    const id = row[0];
                    acceptRejectCrewRequest(id, true);
                  }
                },
                {
                  label: "Reject",
                  style: "danger",
                  icon: "bx bx-x",
                  onClick: (row) => {
                    const id = row[0];
                    acceptRejectCrewRequest(id, false);
                  }
                }
              ]}
            />}

          </div>
        </div>
      </div>
    </div>
  );
}
