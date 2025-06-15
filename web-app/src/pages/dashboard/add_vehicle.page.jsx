import { useState } from "react";
import { Link } from "react-router";
import DynamicForm from "../../components/dynamicForm.component";
import { ENDPOINTS } from "../../constants/urls";
import axiosClient from "../../utils/axiosClient";
import { useNavigate } from 'react-router';

export default function AddVehiclePage(params) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate = useNavigate();


  const addNewVehicleFormFields = [
    { type: "text", name: "name", label: "Name", required: true, placeholder: "Your vehicle name e.g. 'Family car', 'Dad's car'" },
    { type: "text", name: "make", label: "Make", required: true, placeholder: "Your vehicle's make e.g. Tata, Honda, etc." },
    { type: "text", name: "model", label: "Model", required: true, placeholder: "Your vehicle's model e.g. Nexon, Amaze, Tiago NRG, etc." },
    {
      type: "select", name: "type", label: "Type", required: true, options: [
        { value: "car", label: "Car" },
        { value: "motorcycle", label: "Motorcycle" },
        { value: "truck", label: "Truck" },
        { value: "bus", label: "Bus" },
      ]
    },
    {
      type: "select", name: "fuel_type", label: "Fuel Type", required: true, options: [
        { value: "petrol", label: "Petrol" },
        { value: "diesel", label: "Diesel" },
        { value: "cng", label: "CNG" },
        { value: "electric", label: "EV" },
        { value: "hybrid", label: "Hybrid" },
      ]
    },
    { type: "number", name: "mileage", label: "Mileage", placeholder: "", required: true },
    { type: "submit", label: "Add", className: "btn-success", required: true },
  ];

  const handleAddVehicleFormSubmit = async (data) => {
    setButtonLoading(true);
    try {
      const response = await axiosClient.post(ENDPOINTS.ADD_NEW_VEHICLE,
        {
          "name": data.name,
          "make": data.make,
          "model": data.model,
          "type": data.type,
          "fuel_type": data.fuel_type,
          "mileage": data.mileage
        }
      );

      if (response.status === 201) {
        setSuccessMessage(response.data?.message || "Vehicle added successfully");
        navigate('/dashboard/vehicles');
      } else {
        setErrorMessage(response.data?.message || "Unable to add new vehicle");
      }
    } catch (error) {
      setErrorMessage("Unable to add new vehicle");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-3">

        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Add a new vehicle</h3>
          <Link to="/dashboard/vehicles" className="btn btn-danger col-6 col-lg-2 mb-3">Cancel</Link>
        </div>

        <div className="row">
          {/* Forms */}
          <div className="row">
            <div className="col-12">
              <DynamicForm title="Add vehicle" fields={addNewVehicleFormFields} onSubmit={handleAddVehicleFormSubmit} buttonLoading={buttonLoading} />
            </div>

            {!buttonLoading && successMessage && (
              <div className="alert alert-success alert-dismissible fade show">
                {successMessage}
              </div>
            )}

            {!buttonLoading && errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show">
                {errorMessage}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}