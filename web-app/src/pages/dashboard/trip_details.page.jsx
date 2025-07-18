import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import DashboardCard from "../../components/dashboardCard.component";
import Chat from "../../components/chat.component";
import axiosClient from "../../utils/axiosClient";
import { ENDPOINTS } from "../../constants/urls";
import { formatDateToDDMMYYYYWithTime12 } from "../../utils/dateUtils";
import '../../styles/tripdetails.css';


export default function TripDetailsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const tripId = searchParams.get('trip_id');

  // Sample chat messages for demonstration
  const sampleMessages = [
    {
      id: 1,
      sender: "John Doe",
      message: "Hey everyone! Looking forward to this trip to Goa! 🏖️",
      timestamp: "2024-01-15T10:30:00Z",
      isCurrentUser: false,
      avatar: null
    },
    {
      id: 2,
      sender: "You",
      message: "Same here! Can't wait to explore the beaches and try some local cuisine.",
      timestamp: "2024-01-15T10:35:00Z",
      isCurrentUser: true,
      avatar: null
    },
    {
      id: 3,
      sender: "Alice Smith",
      message: "Should we plan some activities beforehand? I heard Dudhsagar Falls is amazing!",
      timestamp: "2024-01-15T11:00:00Z",
      isCurrentUser: false,
      avatar: null
    },
    {
      id: 4,
      sender: "Mike Johnson",
      message: "Great idea! I'll research some water sports activities too.",
      timestamp: "2024-01-15T11:15:00Z",
      isCurrentUser: false,
      avatar: null
    }
  ];

  const fetchTripDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get(`${ENDPOINTS.GET_TRIP_DETAILS}${tripId}/`);

      if (response.status === 200 && response.data.success) {
        setTripData(response.data.data);
        setChatMessages(sampleMessages);
        setUnreadCount(2); // Simulate unread messages
      } else {
        setError(response.data.message || "Failed to fetch trip details");
      }
    } catch (err) {
      console.error("Error fetching trip details:", err);
      setError("Failed to fetch trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tripId) {
      navigate('/404');
      return;
    }

    fetchTripDetails();
  }, [tripId, navigate]);

  const handleSendMessage = (messageData) => {
    const newMsg = {
      id: chatMessages.length + 1,
      sender: "You",
      message: messageData.text,
      timestamp: messageData.timestamp,
      isCurrentUser: true,
      avatar: null,
      type: messageData.type || 'text',
      file: messageData.file || null
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleEditMessage = (messageId, newText) => {
    const updatedMessages = chatMessages.map(msg =>
      msg.id === messageId ? { ...msg, message: newText } : msg
    );
    setChatMessages(updatedMessages);
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = chatMessages.filter(msg => msg.id !== messageId);
    setChatMessages(updatedMessages);
  };

  const handleReactToMessage = (messageId, reaction) => {
    const updatedMessages = chatMessages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || {};
        reactions[reaction] = (reactions[reaction] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    });
    setChatMessages(updatedMessages);
  };

  const toggleChat = () => {
    setIsChatExpanded(!isChatExpanded);
    if (!isChatExpanded) {
      setUnreadCount(0); // Clear unread count when opening chat
    }
  };

  const calculateTotalCost = () => {
    if (!tripData) return 0;

    const fuelCost = tripData.vehicles.reduce((sum, vehicle) =>
      sum + parseFloat(vehicle.calculated_fuel_cost || 0), 0
    );
    const accommodationCost = parseFloat(tripData.calculated_accomodation_cost || 0);
    const foodCost = parseFloat(tripData.calculated_food_cost || 0);

    return fuelCost + accommodationCost + foodCost;
  };

  const calculateEstimatedDays = () => {
    if (!tripData) return 0;
    const distance = parseFloat(tripData.distance || 0);
    const avgPerDay = parseFloat(tripData.average_distance_per_day || 1);
    return Math.ceil(distance / avgPerDay);
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading trip details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">
                <i className="bx bx-error-circle me-2"></i>
                Error Loading Trip Details
              </h4>
              <p>{error}</p>
              <hr />
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => navigate('/dashboard/trips')}
                >
                  <i className="bx bx-arrow-back me-2"></i>Back to Trips
                </button>
                <button
                  className="btn btn-danger"
                  onClick={fetchTripDetails}
                >
                  <i className="bx bx-refresh me-2"></i>Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Cost",
      value: `₹${calculateTotalCost().toLocaleString()}`,
      badgeText: "",
      description: "Estimated Trip Cost",
    },
    {
      title: "Travelers",
      value: tripData?.travellers?.length || 0,
      badgeText: "",
      description: "People on this trip",
    },
    {
      title: "Vehicles",
      value: tripData?.vehicles?.length || 0,
      badgeText: "",
      description: "Total vehicles",
    },
    {
      title: "Duration",
      value: `${calculateEstimatedDays()} days`,
      badgeText: "",
      description: "Estimated trip duration",
    },
  ];

  return (
    <>
      <div className="container-fluid">
        <div className="mb-4">
          {/* Header */}
          <div className="row justify-content-between align-items-center mb-4">
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-primary bg-gradient rounded-circle p-3 d-inline-flex">
                    <i className="bx bx-trip text-white fs-4"></i>
                  </div>
                </div>
                <div>
                  <h1 className="h3 mb-1 fw-bold">Trip Details</h1>
                  <p className="text-muted mb-0">
                    {tripData?.origin_location} → {tripData?.destination_location}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-outline-secondary btn-lg"
                onClick={() => navigate('/dashboard/trips')}
              >
                <i className="bx bx-arrow-back me-2"></i>Back to Trips
              </button>
            </div>
          </div>

          {/* Trip Overview Cards */}
          <div className="row mb-4">
            {cards.map((card, idx) => (
              <div className="col-12 col-md-6 col-lg-3" key={idx}>
                <DashboardCard {...card} />
              </div>
            ))}
          </div>

          {/* Trip Information - Now Full Width */}
          <div className="row">
            <div className="col-12">
              {/* Trip Route Information */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    <i className="bx bx-map me-2"></i>Trip Route
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted">Origin</h6>
                      <p className="h5 mb-3">
                        <i className="bx bx-map-pin text-success me-2"></i>
                        {tripData?.origin_location}
                      </p>
                      <small className="text-muted">
                        Coordinates: {tripData?.origin_lat?.toFixed(4)}, {tripData?.origin_long?.toFixed(4)}
                      </small>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Destination</h6>
                      <p className="h5 mb-3">
                        <i className="bx bx-map-pin text-danger me-2"></i>
                        {tripData?.destination_location}
                      </p>
                      <small className="text-muted">
                        Coordinates: {tripData?.destination_lat?.toFixed(4)}, {tripData?.destination_long?.toFixed(4)}
                      </small>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-4">
                      <h6 className="text-muted">Total Distance</h6>
                      <p className="h5 text-primary">{tripData?.distance} {tripData?.distance_unit}</p>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-muted">Daily Distance</h6>
                      <p className="h5">{tripData?.average_distance_per_day} {tripData?.distance_unit}</p>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-muted">Estimated Duration</h6>
                      <p className="h5">{calculateEstimatedDays()} days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="card-title mb-0">
                    <i className="bx bx-wallet me-2"></i>Cost Breakdown
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded">
                        <i className="bx bx-gas-pump text-warning fs-2"></i>
                        <h6 className="text-muted mt-2">Fuel Cost</h6>
                        <p className="h5 text-warning">
                          ₹{tripData?.vehicles?.reduce((sum, vehicle) =>
                            sum + parseFloat(vehicle.calculated_fuel_cost || 0), 0)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded">
                        <i className="bx bx-bed text-info fs-2"></i>
                        <h6 className="text-muted mt-2">Accommodation</h6>
                        <p className="h5 text-info">₹{parseFloat(tripData?.calculated_accomodation_cost || 0)?.toLocaleString()}</p>
                        <small className="text-muted">₹{tripData?.accomodation_cost_per_day}/day</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded">
                        <i className="bx bx-restaurant text-danger fs-2"></i>
                        <h6 className="text-muted mt-2">Food</h6>
                        <p className="h5 text-danger">₹{parseFloat(tripData?.calculated_food_cost || 0)?.toLocaleString()}</p>
                        <small className="text-muted">₹{tripData?.food_cost_per_day}/day</small>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted">Accommodation Days</h6>
                      <p className="h6">{tripData?.accomodation_days} days</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Total Estimated Cost</h6>
                      <p className="h4 text-success">₹{calculateTotalCost().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-info text-white">
                  <h5 className="card-title mb-0">
                    <i className="bx bx-car me-2"></i>Vehicle Information
                  </h5>
                </div>
                <div className="card-body">
                  {tripData?.vehicles?.map((vehicle, index) => (
                    <div key={vehicle.id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="text-primary mb-0">
                          <i className="bx bx-car me-2"></i>Vehicle #{index + 1}
                        </h6>
                        <span className="badge bg-primary">ID: {vehicle.vehicle}</span>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <small className="text-muted">Driver</small>
                          <p className="mb-1 fw-bold">User ID: {vehicle.driver}</p>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">Passengers</small>
                          <p className="mb-1 fw-bold">
                            {vehicle.passengers?.length || 0} people
                          </p>
                          {vehicle.passengers?.length > 0 && (
                            <small className="text-muted">
                              IDs: {vehicle.passengers.join(', ')}
                            </small>
                          )}
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">Fuel Cost per Unit</small>
                          <p className="mb-1 fw-bold">₹{vehicle.fuel_cost_per_unit}</p>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">Total Fuel Cost</small>
                          <p className="mb-1 fw-bold text-success">₹{vehicle.calculated_fuel_cost}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trip Metadata */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-secondary text-white">
                  <h5 className="card-title mb-0">
                    <i className="bx bx-info-circle me-2"></i>Trip Metadata
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted">Trip ID</h6>
                      <p className="h6">{tripData?.id}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Organizer</h6>
                      <p className="h6">User ID: {tripData?.organizer}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted">Created On</h6>
                      <p className="h6">{formatDateToDDMMYYYYWithTime12(tripData?.created_at)}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Last Updated</h6>
                      <p className="h6">{formatDateToDDMMYYYYWithTime12(tripData?.updated_at)}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-muted">Last Updated By</h6>
                      <p className="h6">User ID: {tripData?.updated_by}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Travellers</h6>
                      <p className="h6">
                        {tripData?.travellers?.length || 0} people
                        {tripData?.travellers?.length > 0 && (
                          <small className="text-muted d-block">
                            IDs: {tripData.travellers.join(', ')}
                          </small>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="floating-chat-container">
        {!isChatExpanded && (
          <button
            className="floating-chat-button"
            onClick={toggleChat}
            aria-label="Open chat"
          >
            <i className="bx bx-chat fs-4"></i>
            {unreadCount > 0 && (
              <span className="chat-notification-badge">{unreadCount}</span>
            )}
          </button>
        )}

        {/* Floating Chat Modal */}
        {isChatExpanded && (
          <div className="floating-chat-modal">
            <div className="floating-chat-header">
              <h6 className="mb-0">
                <i className="bx bx-chat me-2"></i>
                Trip Group Chat
              </h6>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="floating-chat-body">
              <Chat
                title=""
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                currentUser={{ id: 1, name: "You" }}
                height="400px"
                showTimestamp={true}
                showUserAvatar={true}
                enableEmojiPicker={true}
                enableFileUpload={true}
                showMessageReactions={true}
                reactions={['👍', '❤️', '😂', '🔥', '🎉', '✈️', '🏖️']}
                onReactToMessage={handleReactToMessage}
                placeholder="Type your message..."
                maxMessageLength={500}
                groupMessages={true}
                autoScroll={true}
                showSearchBar={false}
                allowEdit={true}
                allowDelete={true}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                theme="light"
                className="floating-chat-component"
                mentionEnabled={true}
                onUserMention={(username) => {
                  console.log('Mentioned user:', username);
                }}
                highlightSearchResults={true}
                showMessageStatus={true}
                messageActions={[
                  {
                    label: "Copy",
                    icon: "bx bx-copy",
                    onClick: (message) => {
                      navigator.clipboard.writeText(message.message);
                      console.log('Message copied to clipboard');
                    }
                  },
                  {
                    label: "Reply",
                    icon: "bx bx-reply",
                    onClick: (message) => {
                      console.log('Replying to message:', message.id);
                    }
                  }
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
