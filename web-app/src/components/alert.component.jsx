import { useEffect } from 'react';

export default function Alert({ message, type = 'info', onClose, autoClose = true, duration = 5000 }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show mt-2 mb-2`} role="alert">
      <div>{message}</div>
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
}
