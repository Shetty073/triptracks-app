import { Routes, Route } from "react-router";
import AuthPage from "./pages/auth.page";
import HomePage from "./pages/home.page";
import DashboardPage from "./pages/dashboard/dashboard.page";
import ProtectedRoute from "./components/protectedRoute.component";
import { AuthProvider } from "./contexts/authContext";
import UnAuthenticatedRoute from "./components/unauthenticatedRoute.component";

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<UnAuthenticatedRoute />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<DashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App;
