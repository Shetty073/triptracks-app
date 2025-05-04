// components/DynamicForm.jsx
import { useState } from "react";

export default function DynamicForm({ title, fields = [], onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div>
      <h3 className="fw-bold fs-4 my-3 text-capitalize">{title}</h3>
      <form onSubmit={handleSubmit}>
        {fields.map((field, idx) => {
          const { type, name, label, options, placeholder, helpText, className, ...rest } = field;
          const id = `field-${name}-${idx}`;
          const commonProps = {
            id,
            name,
            value: formData[name] || (type === "checkbox" ? false : ""),
            onChange: (e) =>
              handleChange(name, type === "checkbox" ? e.target.checked : e.target.value),
            className: `form-control${type === "checkbox" ? "-check" : ""}`,
            placeholder: placeholder || "",
            ...rest,
          };

          return (
            <div className={`mb-3${type === "checkbox" ? " form-check" : ""}`} key={idx}>
              {(type !== "checkbox" && type !== "button" && type !== "submit") && <label htmlFor={id} className="form-label">{label}</label>}

              {type === "textarea" ? (
                <textarea {...commonProps} rows="3" />
              ) : type === "select" ? (
                <select {...commonProps}>
                  {options?.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : type === "checkbox" ? (
                <>
                  <input type="checkbox" checked={formData[name] || false} {...commonProps} />
                  <label htmlFor={id} className="form-check-label">{label}</label>
                </>
              ) : type === "button" || type === "submit" ? (
                <button type={type} className={`btn ${className || "btn-primary"}`} {...rest}>
                  {label} - {`btn ${className || "btn-primary"}`}
                </button>
              ) : (
                <input type={type} {...commonProps} />
              )}

              {helpText && type !== "checkbox" && (
                <div id={`${id}Help`} className="form-text">{helpText}</div>
              )}
            </div>
          );
        })}
      </form>
    </div>
  );
}
