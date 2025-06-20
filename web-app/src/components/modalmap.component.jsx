import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    }
  });
  return <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />;
}

export default function ModalMap({ title, center, marker, onClose, onSelect, icon, zoom = 10 }) {
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <MapContainer center={center} zoom={zoom} style={{ height: "400px" }}>
              <LocationSelector onSelect={onSelect} />
              {marker && <Marker position={marker} icon={icon} />}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
