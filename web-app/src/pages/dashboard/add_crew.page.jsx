import { useState, useEffect } from "react";
import { Link } from "react-router";
import axiosClient from "../../utils/axiosClient";
import { ENDPOINTS } from "../../constants/urls";

export default function AddCrewPage() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Debounce input by 1 second
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(searchInputValue), 1000);
    return () => clearTimeout(timer);
  }, [searchInputValue]);

  // Perform search when debouncedInput changes
  useEffect(() => {
    if (debouncedInput.trim()) {
      searchUser(debouncedInput);
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [debouncedInput]);

  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value);
    setLoading(true);
    setButtonLoading(false);
    setUsers([]);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const searchUser = async (query) => {
    try {
      const response = await axiosClient.get(`${ENDPOINTS.SEARCH_USER_BY_USERNAME_OR_EMAIL}${query}`);
      const results = response.data?.results;

      if (response.status === 200 && Array.isArray(results)) {
        setUsers(results);
      } else {
        setErrorMessage(response.data?.message || 'No results found.');
      }
    } catch (error) {
      setErrorMessage('Unable to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCrew = async (userId) => {
    setButtonLoading(true);
    try {
      const response = await axiosClient.post(ENDPOINTS.SEND_CREW_REQUEST, { to_user: userId });

      if (response.status === 201) {
        setSuccessMessage(response.data?.message || "Crew request sent successfully");
        setUsers([]);
      } else {
        setErrorMessage(response.data?.message || "Unable to send crew request");
      }
    } catch (error) {
      setErrorMessage("Unable to send crew request");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Header and cancel button */}
      <div className="row justify-content-between mb-3">
        <h3 className="fw-bold fs-4 col-6 col-md-4">Add a new crew</h3>
        <Link to="/dashboard/crew" className="btn btn-danger col-6 col-lg-2">Cancel</Link>
      </div>

      {/* Search bar */}
      <div className="row mb-3">
        <div className="input-group">
          <span className="input-group-text">@</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users by username, email or phone number"
            value={searchInputValue}
            onChange={handleInputChange}
            aria-label="User search bar"
          />
        </div>
      </div>

      {/* Results / Messages */}
      <div className="mb-5">
        {loading && (
          <div className="d-flex justify-content-center mb-3">
            <div className="spinner-grow text-secondary" role="status" />
          </div>
        )}

        {users.map(user => (
          <div key={user.id} className="card d-flex flex-row mb-3">
            <div className="card-header">
              <img src={user.profile_photo} alt="Profile" height={100} />
            </div>
            <div className="card-body d-flex flex-row justify-content-between align-items-center">
              <div>
                <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                <div className="card-text">
                  <div><strong>Username:</strong> {user.username}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleAddToCrew(user.id)}
                disabled={buttonLoading}
              >
                Add to crew
              </button>
            </div>
          </div>
        ))}

        {!loading && successMessage && (
          <div className="alert alert-success alert-dismissible fade show">
            {successMessage}
          </div>
        )}

        {!loading && errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
