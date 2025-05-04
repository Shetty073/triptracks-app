import { Link } from "react-router";
import DashboardCard from "../../components/dashboardCard.component";
import DashboardTable from "../../components/dashboardTable.component";

export default function TripsPage() {
  const cards = [
    {
      title: "Distance Travelled",
      value: "7,648 KM",
      badgeText: "+9.0%",
      description: "Since Last Year",
    },
    {
      title: "Fuel Consumed",
      value: "1121 Litres",
      badgeText: "+0.8%",
      description: "Since Last Year",
    },
    {
      title: "Locations Visited",
      value: "18",
      badgeText: "+5.1%",
      description: "Since Last Year",
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
          <h3 className="fw-bold fs-4 mb-3 text-capitalize col-6 col-md-4">Trips Dashboard</h3>
          <Link to="/dashboard/trips/plan" className="btn btn-primary col-6 col-lg-2 mb-3">Plan a new trip</Link>
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
            <DashboardTable title="Upcoming Trips" columns={userColumns} data={userData} />
          </div>
          <div className="col-12 col-md-6">
            <DashboardTable title="Past Trips" columns={orderColumns} data={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
}
