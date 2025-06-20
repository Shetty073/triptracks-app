import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import haversine from "haversine-distance";

import ModalMap from "../../components/modalmap.component";
import usePermissionPrompt from "../../hooks/usePermissionPrompt";

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

  const { requestPermission, PromptComponent } = usePermissionPrompt();
  const crewSelectRef = useRef(null);

  const vehicleTypes = [
    { id: 1, name: "SUV" },
    { id: 2, name: "Sedan" },
  ];

  const crewMembers = [
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
  ];

  const myself = { id: 1, name: "Myself" };
  const fullCrewList = [myself, ...crewMembers];

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

  useEffect(() => {
    if (crewSelectRef.current) {
      const ch = new Choices(crewSelectRef.current, {
        removeItemButton: true,
        searchEnabled: true,
        classNames: {
          containerInner: "form-control",
        },
      });
      crewSelectRef.current.addEventListener("change", (e) => {
        setTravellers([...e.target.selectedOptions].map((o) => +o.value));
      });
      return () => ch.destroy();
    }
  }, []);

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

  const handleSubmit = () => {
    const errors = [];
    if (!originName || !originCoords) errors.push("Origin");
    if (!destinationName || !destinationCoords) errors.push("Destination");
    if (!averagePerDay || !accommodationCost || !foodCost) errors.push("Trip details");
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

    console.log("📦 Payload:", JSON.stringify(payload, null, 2));
  };

  const usedMembers = getUsedMembers();

  return (
    <div className="container py-4">
      {PromptComponent}
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
              <label>Distance</label>
              <input className="form-control" readOnly value={distance} />
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

        {/* Crew Selection (excluding "Myself") */}
        <div className="col-12">
          <label>Crew (select) *</label>
          <select multiple ref={crewSelectRef} defaultValue={travellers} className="form-control">
            {crewMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
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
                <select className="form-select" value={v.vehicle} onChange={(e) => handleVehicleField(i, "vehicle", e.target.value)}>
                  <option value="">Select</option>
                  {vehicleTypes.map((vt) => (
                    <option key={vt.id} value={vt.id}>{vt.name}</option>
                  ))}
                </select>
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
          <button className="btn btn-success w-100" onClick={handleSubmit}>
            Submit Trip
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
