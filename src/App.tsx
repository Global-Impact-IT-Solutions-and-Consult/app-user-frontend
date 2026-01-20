import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyAccount from "./pages/VerifyAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OnboardingFlow from "./pages/OnboardingFlow";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import { DashboardLayout } from "./components/DashboardLayout";
import RequireAuth from "./components/RequireAuth";
import RequireGuest from "./components/RequireGuest";
import RequireCompany from "./components/RequireCompany";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route element={<RequireGuest />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<OnboardingFlow />} />

        {/* Dashboard Routes with Shared Layout */}
        <Route element={<RequireCompany />}>
          <Route path="/dashboard" element={<DashboardLayout><Outlet /></DashboardLayout>}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/:id" element={<InvoiceDetails />} />
            <Route path="logs" element={<Logs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}



export default App;



