import { Link } from "react-router";
import DashboardCard from "../../components/dashboardCard.component";
import DashboardTable from "../../components/dashboardTable.component";

export default function VehiclesPage() {
  const cards = [
    {
      title: "Fuel Consumed",
      value: "1121 Litres",
      badgeText: "+0.8%",
      description: "Since Last Year",
    },
    {
      title: "Fuel Cost",
      value: "₹ 1,34,564",
      badgeText: "+5.1%",
      description: "Since Last Year",
    },
    {
      title: "Highest Fuel Average",
      value: "17.45 KM/L",
      badgeText: "",
      description: "Vehicle: Tata Nexon",
    },
  ];

  const userColumns = ["#", "First", "Last", "Handle"];
  const userData = [
    ["1", "Mark", "Otto", "@mdo"],
    ["2", "Jacob", "Thornton", "@fat"],
    ["3", ["Larry the Bird", 2], "@twitter"],
  ];

  const orderColumns = ["#", "Product", "Quantity", "Cost"];
  const orderData = [
    ["ORD_1", "AMD CPU", "1", "₹ 23,456"],
    ["ORD_2", "Nvidia GPU", "2", "₹ 61,899"],
    ["ORD_3", "HyperX RAM", "2", "₹ 7,399"],
  ];

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <div className="row justify-content-between">
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-4">Vehicles Dashboard</h3>
          <Link to="/dashboard/vehicles/add" className="btn btn-primary col-2 mb-3">Add a new vehicle</Link>
        </div>

        {/* Cards */}
        <div className="row">
          {cards.map((card, idx) => (
            <div className="col-12 col-md-4" key={idx}>
              <DashboardCard {...card} />
            </div>
          ))}
        </div>

        {/* Table & Chart */}
        <div className="row">
          <div className="col-12 col-md-6">
            <DashboardTable title="My Vehicles" columns={userColumns} data={userData} />
          </div>
          <div className="col-12 col-md-6">
            <DashboardTable title="Crew Vehicles" columns={orderColumns} data={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
}
