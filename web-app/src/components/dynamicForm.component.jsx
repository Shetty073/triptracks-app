import { useState } from "react";

export default function DynamicForm({ title, fields = [], onSubmit, buttonLoading = false }) {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e, field) => {
    const { type, name, multiple } = field;
    const { value, checked, files } = e.target;

    if (type === "checkbox") {
      handleChange(name, checked);
    } else if (type === "radio") {
      handleChange(name, value);
    } else if (type === "file") {
      handleChange(name, files.length === 1 ? files[0] : Array.from(files));
    } else if (type === "number") {
      const numVal = e.target.value;
      const parsed =
        numVal === ""
          ? ""
          : field.step && Number(field.step) % 1 !== 0
            ? parseFloat(numVal)
            : parseInt(numVal, 10);
      handleChange(name, parsed);
    } else if (type === "select" && multiple) {
      handleChange(name, Array.from(e.target.selectedOptions).map((o) => o.value));
    } else {
      handleChange(name, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {};
    fields.forEach((field) => {
      const { name, type, multiple, value: defaultValue, checked: defaultChecked } = field;

      if (name !== undefined) {
        if (formData[name] !== undefined) {
          finalData[name] = formData[name];
        } else {
          if (type === "checkbox") {
            finalData[name] = defaultChecked || false;
          } else if (type === "radio") {
            finalData[name] = "";
          } else if (type === "file") {
            finalData[name] = null;
          } else if (type === "select" && multiple) {
            finalData[name] = [];
          } else {
            finalData[name] = defaultValue || "";
          }
        }
      }
    });

    onSubmit?.(finalData);
  };

  return (
    <div>
      <h3 className="fw-bold fs-4 my-3 text-capitalize">{title}</h3>
      <form onSubmit={handleSubmit}>
        {fields.map((field, idx) => {
          const {
            type,
            name,
            label,
            options,
            placeholder,
            helpText,
            className,
            multiple,
            readOnly,
            disabled,
            required,
            value: defaultValue,
            checked: defaultChecked,
            ...rest
          } = field;

          const id = `field-${name}-${idx}`;
          const isCheckbox = type === "checkbox";
          const isRadio = type === "radio";
          const isFile = type === "file";
          const isSelect = type === "select";

          const commonProps = {
            id,
            name,
            onChange: (e) => handleInputChange(e, field),
            className: `form-control${isCheckbox || isRadio ? "-check" : ""}`,
            placeholder: placeholder || "",
            multiple,
            readOnly,
            disabled,
            required: required || false,
            ...rest,
          };

          let inputField;

          if (type === "textarea") {
            inputField = (
              <textarea
                {...commonProps}
                value={formData[name] ?? defaultValue ?? ""}
                rows="3"
              />
            );
          } else if (isSelect) {
            const selected = formData[name] ?? defaultValue ?? (multiple ? [] : "");
            inputField = (
              <select {...commonProps} value={selected}>
                {!multiple && <option value="">Select...</option>}
                {options?.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          } else if (isCheckbox) {
            inputField = (
              <>
                <input
                  type="checkbox"
                  checked={formData[name] ?? defaultChecked ?? false}
                  {...commonProps}
                />
                <label htmlFor={id} className="form-check-label">
                  {label} {required && <span className="text-danger">*</span>}
                </label>
              </>
            );
          } else if (isRadio) {
            inputField = options?.map((opt, i) => (
              <div className="form-check" key={i}>
                <input
                  type="radio"
                  id={`${id}-${i}`}
                  name={name}
                  value={opt.value}
                  checked={formData[name] === opt.value}
                  className="form-check-input"
                  onChange={(e) => handleInputChange(e, field)}
                  required={required && i === 0}
                />
                <label className="form-check-label" htmlFor={`${id}-${i}`}>
                  {opt.label}
                </label>
              </div>
            ));
          } else if (type === "submit" || type === "button") {
            inputField = (
              <button
                type={type}
                className={`btn ${className || "btn-primary"}`}
                disabled={buttonLoading || disabled}
                {...rest}
              >
                {buttonLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  label
                )}
              </button>
            );
          } else {
            inputField = (
              <input
                type={type}
                {...commonProps}
                value={isFile ? undefined : formData[name] ?? defaultValue ?? ""}
              />
            );
          }

          return (
            <div
              className={`mb-3${isCheckbox || isRadio ? " form-check" : ""}`}
              key={idx}
            >
              {!isCheckbox &&
                !isRadio &&
                type !== "button" &&
                type !== "submit" && (
                  <label htmlFor={id} className="form-label">
                    {label} {required && <span className="text-danger">*</span>}
                  </label>
                )}
              {inputField}
              {helpText && type !== "checkbox" && (
                <div id={`${id}Help`} className="form-text">
                  {helpText}
                </div>
              )}
            </div>
          );
        })}
      </form>
    </div>
  );
}


// supported fiel types
// [
//   { type: "text", name: "username", label: "Username", placeholder: "Enter name", required: true },
//   { type: "email", name: "email", label: "Email", required: true },
//   { type: "password", name: "password", label: "Password", minLength: 6 },
//   { type: "file", name: "avatar", label: "Profile Picture", accept: "image/*", multiple: false },
//   { type: "date", name: "dob", label: "Date of Birth" },
//   { type: "radio", name: "gender", label: "Gender", required: true, options: [
//     { value: "male", label: "Male" },
//     { value: "female", label: "Female" }
//   ]},
//   { type: "range", name: "satisfaction", label: "Satisfaction", min: 1, max: 10 },
//   { type: "select", name: "country", label: "Country", required: true, options: [
//     { value: "in", label: "India" },
//     { value: "us", label: "USA" }
//   ], multiple: true },
//   { type: "submit", label: "Register", className: "btn-success" },
// ]
