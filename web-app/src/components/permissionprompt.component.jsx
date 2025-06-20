import { useEffect } from "react";

export default function PermissionPrompt({ message, onAccept, onDecline }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Permission Required</h5>
            <button type="button" className="btn-close" onClick={onDecline}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onDecline}>Cancel</button>
            <button className="btn btn-primary" onClick={onAccept}>Okay</button>
          </div>
        </div>
      </div>
    </div>
  );
}
