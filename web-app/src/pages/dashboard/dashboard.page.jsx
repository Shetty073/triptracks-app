import { useEffect } from 'react'
import { Routes, Route } from "react-router";
import SideNav from '../../components/sidenav.component';
import TopNav from '../../components/topnav.component';
import Footer from '../../components/footer.component';
import TripsPage from './trips.page';
import FormsPage from './forms.page';

export default function DashboardPage() {
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("theme");
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
            <Route path="/forms" element={<FormsPage />} />
          </Routes>
        </main>

        {/* Footer content */}
        <Footer />

      </div>

    </div>
  )
}
