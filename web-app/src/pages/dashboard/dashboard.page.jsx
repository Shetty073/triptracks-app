import { useEffect } from 'react';
import { Routes, Route } from "react-router";
import SideNav from '../../components/sidenav.component';
import TopNav from '../../components/topnav.component';
import Footer from '../../components/footer.component';
import TripsPage from './trips.page';
import TripDetailsPage from './trip_details.page';
import PlanTripPage from './plan_trips.page';
import AddVehiclePage from './add_vehicle.page';
import VehiclesPage from './vehicles.page';
import AddCrewPage from './add_crew.page';
import CrewPage from './crew.page';
import FormsPage from './forms.page';

export default function DashboardPage() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);

      const tables = document.querySelectorAll(".table");
      if (savedTheme === "dark") {
        tables.forEach(table => table.classList.add("table-dark"));
      } else {
        tables.forEach(table => table.classList.remove("table-dark"));
      }
    }
  }, []);

  return (
    <div className="wrapper">
      {/* Side navigation bar */}
      <SideNav />

      <div className="main">
        {/* Dashboard navbar */}
        <TopNav />

        {/* Main dashboard contents */}
        <main className="content px-3 py-4">
          <Routes>
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/plan" element={<PlanTripPage />} />

            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles/add" element={<AddVehiclePage />} />

            <Route path="/crew" element={<CrewPage />} />
            <Route path="/crew/add" element={<AddCrewPage />} />

            <Route path="/trips/detail" element={<TripDetailsPage />} />

            <Route path="/forms" element={<FormsPage />} />
          </Routes>
        </main>

        {/* Footer content */}
        <Footer />

      </div>

    </div>
  )
}
