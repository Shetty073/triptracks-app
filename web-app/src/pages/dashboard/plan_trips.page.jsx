import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import haversine from "haversine-distance";

import ModalMap from "../../components/modalmap.component";
import usePermissionPrompt from "../../hooks/usePermissionPrompt";
import axiosClient from "../../utils/axiosClient";
import { ENDPOINTS } from "../../constants/urls";

import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const originIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: markerShadow,
});

const destinationIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: markerShadow,
});

export default function PlanTripPage() {
  const navigate = useNavigate();
  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState("");
  const [unit, setUnit] = useState("km");
  const [averagePerDay, setAveragePerDay] = useState("");
  const [accommodationCost, setAccommodationCost] = useState("");
  const [foodCost, setFoodCost] = useState("");
  const [travellers, setTravellers] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);
  const [showOriginMap, setShowOriginMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);

  // New state for API data with pagination
  const [crewMembers, setCrewMembers] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pagination states
  const [crewPage, setCrewPage] = useState(1);
  const [crewHasMore, setCrewHasMore] = useState(true);
  const [crewLoading, setCrewLoading] = useState(false);
  const [vehiclePage, setVehiclePage] = useState(1);
  const [vehicleHasMore, setVehicleHasMore] = useState(true);
  const [vehicleLoading, setVehicleLoading] = useState(false);

  const { requestPermission, PromptComponent } = usePermissionPrompt();
  const crewSelectRef = useRef(null);
  const crewChoicesRef = useRef(null);

  const myself = { id: 1, name: "Myself" };

  // API call functions with pagination
  const fetchCrewMembers = async (page = 1, append = false) => {
    if (crewLoading) return;
    setCrewLoading(true);
    
    try {
      const response = await axiosClient.get(`${ENDPOINTS.FETCH_CREW_MEMBERS_FOR_CURRENT_USER}?page=${page}`);
      if (response.status === 200 && response.data.success) {
        const crewData = response.data.data.results || [];
        const processedCrew = crewData.map(crew => ({
          id: crew.requested_user.id,
          name: `${crew.requested_user.first_name} ${crew.requested_user.last_name}`.trim(),
          email: crew.requested_user.email,
          username: crew.requested_user.username
        }));
        
        if (append) {
          setCrewMembers(prev => [...prev, ...processedCrew]);
        } else {
          setCrewMembers(processedCrew);
        }
        
        // Check if there are more pages
        setCrewHasMore(!!response.data.data.next);
        setCrewPage(page);
      } else {
        console.error('Failed to fetch crew members:', response.data.message);
        if (!append) {
          setError(response.data.message || 'Failed to load crew members');
        }
      }
    } catch (error) {
      console.error('Failed to fetch crew members:', error);
      if (!append) {
        setError('Failed to load crew members');
      }
    } finally {
      setCrewLoading(false);
    }
  };

  const fetchUserVehicles = async (page = 1, append = false) => {
    try {
      const response = await axiosClient.get(`${ENDPOINTS.GET_USER_VEHICLES}?page=${page}`);
      if (response.status === 200 && response.data.success) {
        const vehicles = response.data.data.results || [];
        return {
          vehicles,
          hasMore: !!response.data.data.next
        };
      } else {
        console.error('Failed to fetch user vehicles:', response.data.message);
        return { vehicles: [], hasMore: false };
      }
    } catch (error) {
      console.error('Failed to fetch user vehicles:', error);
      return { vehicles: [], hasMore: false };
    }
  };

  const fetchCrewVehicles = async (page = 1, append = false) => {
    try {
      const response = await axiosClient.get(`${ENDPOINTS.GET_USER_CREW_VEHICLES}?page=${page}`);
      if (response.status === 200 && response.data.success) {
        const vehicles = response.data.data.results || [];
        return {
          vehicles,
          hasMore: !!response.data.data.next
        };
      } else {
        console.error('Failed to fetch crew vehicles:', response.data.message);
        return { vehicles: [], hasMore: false };
      }
    } catch (error) {
      console.error('Failed to fetch crew vehicles:', error);
      return { vehicles: [], hasMore: false };
    }
  };

  const updateVehicleTypes = async (page = 1, append = false) => {
    if (vehicleLoading) return;
    setVehicleLoading(true);
    
    try {
      const [userResult, crewResult] = await Promise.all([
        fetchUserVehicles(page),
        fetchCrewVehicles(page)
      ]);

      const allVehicles = [...userResult.vehicles, ...crewResult.vehicles];
      
      // Remove duplicates based on vehicle ID
      const uniqueVehicles = allVehicles.filter((vehicle, index, self) =>
        index === self.findIndex(v => v.id === vehicle.id)
      );

      if (append) {
        setVehicleTypes(prev => {
          const combined = [...prev, ...uniqueVehicles];
          return combined.filter((vehicle, index, self) =>
            index === self.findIndex(v => v.id === vehicle.id)
          );
        });
      } else {
        setVehicleTypes(uniqueVehicles);
      }

      setVehicleHasMore(userResult.hasMore || crewResult.hasMore);
      setVehiclePage(page);
    } catch (error) {
      console.error('Failed to update vehicle types:', error);
      if (!append) {
        setError('Failed to load vehicles');
      }
    } finally {
      setVehicleLoading(false);
    }
  };

  // Scroll handlers for pagination
  const handleCrewScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && crewHasMore && !crewLoading) {
      fetchCrewMembers(crewPage + 1, true);
    }
  };

  const handleVehicleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && vehicleHasMore && !vehicleLoading) {
      updateVehicleTypes(vehiclePage + 1, true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCrewMembers(1, false),
          updateVehicleTypes(1, false)
        ]);
      } catch (error) {
        setError('Failed to initialize data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Location permission
  useEffect(() => {
    (async () => {
      const { granted, coords } = await requestPermission(
        "geolocation",
        "Allow location to center the map."
      );
      if (granted) setUserLocation({ lat: coords.latitude, lng: coords.longitude });
      else setLocationAccessDenied(true);
    })();
  }, []);

  // Choices.js setup with scroll handling
  useEffect(() => {
    if (crewSelectRef.current && crewMembers.length > 0) {
      const ch = new Choices(crewSelectRef.current, {
        removeItemButton: true,
        searchEnabled: true,
        classNames: {
          containerInner: "form-control",
        },
      });
      
      crewChoicesRef.current = ch;
      
      const handleCrewChange = (e) => {
        const selectedIds = [...e.target.selectedOptions].map(o => +o.value);
        setTravellers(selectedIds);
      };

      crewSelectRef.current.addEventListener("change", handleCrewChange);

      // Add scroll event listener to the dropdown
      const choicesDropdown = ch.dropdown.element;
      if (choicesDropdown) {
        choicesDropdown.addEventListener('scroll', handleCrewScroll);
      }
      
      return () => {
        crewSelectRef.current?.removeEventListener("change", handleCrewChange);
        if (choicesDropdown) {
          choicesDropdown.removeEventListener('scroll', handleCrewScroll);
        }
        ch.destroy();
      };
    }
  }, [crewMembers, crewHasMore, crewLoading, crewPage]);

  // Update Choices.js when new crew members are loaded
  useEffect(() => {
    if (crewChoicesRef.current && crewMembers.length > 0) {
      const choices = crewMembers.map(member => ({
        value: member.id,
        label: member.name,
        selected: travellers.includes(member.id)
      }));
      
      crewChoicesRef.current.setChoices(choices, 'value', 'label', true);
    }
  }, [crewMembers]);

  const computeDistance = (a, b) => {
    const d = haversine(a, b) / 1000;
    return unit === "km" ? d.toFixed(2) : (d * 0.621371).toFixed(2);
  };

  const handleSelect = (setter, otherCoords, close, updateAlong) => (pos) => {
    setter(pos);
    if (otherCoords) updateAlong(pos, otherCoords);
    close(false);
  };

  const addVehicle = () => {
    setVehiclesData([
      ...vehiclesData,
      { vehicle: "", driver: "", passengers: [], fuelCost: "" },
    ]);
  };

  const handleVehicleField = (idx, field, value) => {
    const arr = [...vehiclesData];
    arr[idx][field] = value;
    setVehiclesData(arr);
  };

  const getUsedMembers = () => {
    const used = new Set();
    vehiclesData.forEach((v) => {
      if (v.driver) used.add(+v.driver);
      v.passengers.forEach((p) => used.add(+p));
    });
    return used;
  };

  const handleSubmit = async () => {
    const errors = [];
    if (!originName || !originCoords) errors.push("Origin");
    if (!destinationName || !destinationCoords) errors.push("Destination");
    if (!distance || !averagePerDay || !accommodationCost || !foodCost) errors.push("Trip details");
    if (travellers.length === 0) errors.push("Crew");

    const vehicles = vehiclesData.map((v, i) => {
      if (!v.vehicle || !v.driver || !v.fuelCost)
        errors.push(`Vehicle #${i + 1} fields`);
      return {
        vehicle: +v.vehicle,
        driver: +v.driver,
        passengers: v.passengers.map(Number),
        fuel_cost_per_unit: +v.fuelCost,
      };
    });

    const assigned = new Set();
    vehiclesData.forEach((v) => {
      if (v.driver) assigned.add(+v.driver);
      v.passengers.forEach((p) => assigned.add(+p));
    });

    const unassigned = travellers.filter((id) => !assigned.has(id));
    if (unassigned.length > 0) {
      const names = crewMembers
        .filter((m) => unassigned.includes(m.id))
        .map((m) => m.name);
      errors.push(`Unassigned crew members: ${names.join(", ")}`);
    }

    if (errors.length) {
      alert("Required:\n- " + [...new Set(errors)].join("\n- "));
      return;
    }

    const payload = {
      origin_location: originName,
      origin_lat: originCoords.lat,
      origin_long: originCoords.lng,
      destination_location: destinationName,
      destination_lat: destinationCoords.lat,
      destination_long: destinationCoords.lng,
      distance: +distance,
      distance_unit: unit,
      average_distance_per_day: +averagePerDay,
      vehicles,
      accomodation_cost_per_day: +accommodationCost,
      food_cost_per_day: +foodCost,
      travellers,
    };

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await axiosClient.post('/trip/api/trip/', payload);
      
      if (response.status === 201 && response.data.success) {
        console.log('Trip created successfully:', response.data);
        navigate('/dashboard/trips');
      } else {
        setError(response.data.message || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      setError(error.response?.data?.message || 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  const usedMembers = getUsedMembers();
  const fullCrewList = [myself, ...crewMembers];

  if (loading && crewMembers.length === 0) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {PromptComponent}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button 
            className="btn-close" 
            onClick={() => setError(null)}
          />
        </div>
      )}

      {locationAccessDenied && (
        <div className="alert alert-warning alert-dismissible fade show">
          Location denied — using default center.
          <button className="btn-close" data-bs-dismiss="alert" />
        </div>
      )}

      <div className="d-flex justify-content-between mb-4">
        <h3>Plan a New Trip</h3>
        <Link to="/dashboard/trips" className="btn btn-danger col-6 col-lg-2 mb-3">
          Cancel
        </Link>
      </div>

      <div className="row g-3">
        {/* Origin & Destination */}
        <div className="col-md-6">
          <label>Origin *</label>
          <input className="form-control" value={originName} onChange={(e) => setOriginName(e.target.value)} />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <button className={`btn w-100 ${originCoords ? "btn-outline-success" : "btn-outline-danger"}`} onClick={() => setShowOriginMap(true)}>
            {originCoords ? "Change Origin" : "Select Origin *"}
          </button>
        </div>

        <div className="col-md-6">
          <label>Destination *</label>
          <input className="form-control" value={destinationName} onChange={(e) => setDestinationName(e.target.value)} />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <button className={`btn w-100 ${destinationCoords ? "btn-outline-success" : "btn-outline-danger"}`} onClick={() => setShowDestinationMap(true)}>
            {destinationCoords ? "Change Destination" : "Select Destination *"}
          </button>
        </div>

        {/* Distance Info */}
        {originCoords && destinationCoords && (
          <>
            <div className="col-md-4">
              <label>Distance *</label>
              <input 
                type="number" 
                className="form-control" 
                value={distance} 
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Enter distance"
              />
            </div>
            <div className="col-md-4">
              <label>Unit</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </div>
            <div className="col-md-4">
              <label>Average Distance / Day *</label>
              <input type="number" className="form-control" value={averagePerDay} onChange={(e) => setAveragePerDay(e.target.value)} />
            </div>
          </>
        )}

        {/* Crew Selection */}
        <div className="col-12">
          <label>Crew (select) *</label>
          <select multiple ref={crewSelectRef} className="form-control">
            {crewMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {crewLoading && <small className="text-muted">Loading more crew members...</small>}
        </div>

        {/* Add Vehicle Button */}
        {travellers.length > 0 && (
          <div className="col-12">
            <button className="btn btn-outline-success" onClick={addVehicle}>
              Add Vehicle
            </button>
          </div>
        )}

        {/* Vehicle Cards */}
        {vehiclesData.map((v, i) => (
          <div key={i} className="bg-light rounded p-3 mt-3">
            <h6>Vehicle #{i + 1}</h6>
            <div className="row g-2">
              <div className="col-md-3">
                <label>Type *</label>
                <select 
                  className="form-select" 
                  value={v.vehicle} 
                  onChange={(e) => handleVehicleField(i, "vehicle", e.target.value)}
                  onScroll={handleVehicleScroll}
                >
                  <option value="">Select</option>
                  {vehicleTypes.map((vt) => (
                    <option key={vt.id} value={vt.id}>
                      {vt.name} - {vt.make} {vt.model} ({vt.type})
                    </option>
                  ))}
                </select>
                {vehicleLoading && <small className="text-muted">Loading more vehicles...</small>}
              </div>

              <div className="col-md-3">
                <label>Driver *</label>
                <select className="form-select" value={v.driver} onChange={(e) => handleVehicleField(i, "driver", e.target.value)}>
                  <option value="">Select</option>
                  {fullCrewList
                    .filter((m) => !usedMembers.has(m.id) || v.driver == m.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
              </div>

              <div className="col-md-4">
                <label>Passengers</label>
                <select
                  multiple
                  className="form-control"
                  value={v.passengers}
                  onChange={(e) => handleVehicleField(i, "passengers", [...e.target.selectedOptions].map((o) => +o.value))}
                >
                  {fullCrewList
                    .filter((m) => !usedMembers.has(m.id) || v.passengers.includes(m.id))
                    .map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
              </div>

              <div className="col-md-2">
                <label>Fuel ₹/unit *</label>
                <input
                  type="number"
                  className="form-control"
                  value={v.fuelCost}
                  onChange={(e) => handleVehicleField(i, "fuelCost", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Trip Cost Fields */}
        <div className="col-md-6">
          <label>Accommodation ₹/Day *</label>
          <input type="number" className="form-control" value={accommodationCost} onChange={(e) => setAccommodationCost(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label>Food ₹/Day *</label>
          <input type="number" className="form-control" value={foodCost} onChange={(e) => setFoodCost(e.target.value)} />
        </div>

        <div className="col-12 mt-4">
          <button 
            className="btn btn-success w-100" 
            onClick={handleSubmit}
            disabled={loading || submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Trip...
              </>
            ) : (
              "Submit Trip"
            )}
          </button>
        </div>
      </div>

      {/* Map Modals */}
      {showOriginMap && (
        <ModalMap
          title="Select Origin"
          center={userLocation || [20.59, 78.96]}
          marker={originCoords}
          onClose={() => setShowOriginMap(false)}
          onSelect={handleSelect(setOriginCoords, destinationCoords, setShowOriginMap, (a, b) => setDistance(computeDistance(a, b)))}
          icon={originIcon}
          zoom={10}
        />
      )}

      {showDestinationMap && (
        <ModalMap
          title="Select Destination"
          center={userLocation || [20.59, 78.96]}
          marker={destinationCoords}
          onClose={() => setShowDestinationMap(false)}
          onSelect={handleSelect(setDestinationCoords, originCoords, setShowDestinationMap, (a, b) => setDistance(computeDistance(b, a)))}
          icon={destinationIcon}
          zoom={10}
        />
      )}

      {originCoords && destinationCoords && (
        <div className="mt-5">
          <h5>Trip Map</h5>
          <MapContainer center={originCoords} zoom={6} style={{ height: "400px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={originCoords} icon={originIcon} />
            <Marker position={destinationCoords} icon={destinationIcon} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
