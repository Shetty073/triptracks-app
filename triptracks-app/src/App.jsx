import { Routes, Route } from "react-router";
import AuthPage from "./pages/auth.page";
import HomePage from "./pages/home.page";
import DashboardPage from "./pages/dashboard/dashboard.page";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard">
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
