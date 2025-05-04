import DashboardCard from "../../components/dashboardCard.component";
import DashboardTable from "../../components/dashboardTable.component";

export default function TripsPage() {
  const cards = [
    {
      title: "Member Progress",
      value: "$75,648",
      badgeText: "+9.0%",
      description: "Since Last Month",
    },
    {
      title: "Revenue",
      value: "$120,300",
      badgeText: "+12.4%",
      description: "Growth in Q1",
    },
    {
      title: "New Users",
      value: "1,250",
      badgeText: "+5.1%",
      description: "From Last Week",
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
        <h3 className="fw-bold fs-4 mb-3 text-capitalize">Admin Dashboard</h3>

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
            <DashboardTable title="Users" columns={userColumns} data={userData} />
          </div>
          <div className="col-12 col-md-6">
            <DashboardTable title="Orders" columns={orderColumns} data={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
}
