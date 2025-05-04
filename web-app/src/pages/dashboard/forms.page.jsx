import DashboardCard from "../../components/dashboardCard.component";
import DynamicForm from "../../components/dynamicForm.component";

export default function FormsPage() {
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

  const form1Fields = [
    { type: "email", name: "email", label: "Email address", placeholder: "Enter your email", helpText: "We'll never share your email." },
    { type: "password", name: "password", label: "Password", placeholder: "Enter password" },
    { type: "checkbox", name: "remember", label: "Remember me" },
    { type: "submit", label: "Submit" },
  ];

  const form2Fields = [
    { type: "text", name: "fullName", label: "Full Name", placeholder: "Your full name" },
    {
      type: "select", name: "gender", label: "Gender", options: [
        { value: "", label: "Select" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ]
    },
    { type: "textarea", name: "bio", label: "Bio", placeholder: "Write a short bio" },
    { type: "submit", label: "Send", className: "btn-success" },
  ];

  const handleFormSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

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

        {/* Forms */}
        <div className="row">
          <div className="col-12 col-md-6">
            <DynamicForm title="Add data" fields={form1Fields} onSubmit={handleFormSubmit} />
          </div>
          <div className="col-12 col-md-6">
            <DynamicForm title="Add some more data" fields={form2Fields} onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
