import { useState, useEffect } from "react";
import { Link } from "react-router";
import axiosClient from "../../utils/axiosClient";
import { ENDPOINTS } from "../../constants/urls";

export default function AddCrewPage(params) {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  // Debounce logic: waits 1s after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(searchInputValue);
    }, 1000);

    return () => clearTimeout(timer); // cleanup previous timer
  }, [searchInputValue]);

  // Trigger actual search logic here
  useEffect(() => {
    if (debouncedInput.trim()) {
      searchUserByUsernameOrEmail(debouncedInput);
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [debouncedInput]);

  const handleInputChange = (e) => {
    setLoading(true);
    setButtonLoading(false);
    setUsers([]);
    setErrorMessage("");

    setSearchInputValue(e.target.value);
  };

  const searchUserByUsernameOrEmail = async (userEmailOrUsername) => {
    const response = await axiosClient.get(`${ENDPOINTS.SEARCH_USER_BY_USERNAME_OR_EMAIL}${userEmailOrUsername}`);
    let message = undefined;

    if (response.status === 200) {
      let results = response.data.results;
      if (results !== undefined) {
        setUsers(response.data.results);
      } else {
        message = response.data.message;
      }

    } else {
      message = response.data.message;
      if (message === undefined || message === "") {
        message = "Unable to fetch user details";
      }
    }

    if (message !== null && message !== undefined && message !== "") {
      setErrorMessage(message);
    }

    setLoading(false);
  };

  const handleAddToCrew = async (to_user) => {
    setButtonLoading(true);
    const response = await axiosClient.post(ENDPOINTS.SEND_CREW_REQUEST, {
      "to_user": to_user
    });

    if (response.status === 201) {
      setSuccessMessage(response.data.message)
    } else {
      setErrorMessage(response.data.message)
    }
    setButtonLoading(false);
  };

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
            <input
              type="text"
              className="form-control"
              placeholder="Search users by username, email or phone number"
              aria-label="User search bar"
              aria-describedby="basic-addon1"
              value={searchInputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="mb-5">
            {loading && 
            <div className="d-flex justify-content-center">
              <div className="spinner-grow text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>}

            {users.map((user) => {
              return (
                <div id={user.id} className="card d-flex flex-row">
                  <h5 className="card-header">
                    <img src={user.profile_photo} alt="Profile photo" height={100} />
                  </h5>
                  <div className="card-body d-flex flex-row justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                      <div className="card-text">
                        <div><strong>Username:</strong> {user.username}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                      </div>
                    </div>
                    <div>
                      <button type="button" className="btn btn-primary" onClick={() => {handleAddToCrew(user.id)}} disabled={buttonLoading}>Add to crew</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {(successMessage && !loading) && 
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>}

            {(errorMessage && !loading) && 
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>}

          </div>
        </div>

      </div>
    </div>
  );
}
