import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCompanyStore } from "../store/companyStore";

export default function RequireAuth() {
    const { isAuthenticated, accessToken } = useAuthStore();
    const { currentCompany, companies } = useCompanyStore();
    const location = useLocation();

    console.log("companies", companies);

    // Check if authenticated (store state + token existence)
    if (!isAuthenticated || !accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    // Check if user has a company (onboarding complete)
    // If not, and trying to access anything other than onboarding, redirect to onboarding
    if (companies.length == 0 && location.pathname === "/dashboard") {
        return <Navigate to="/onboarding" replace />;
    }
    return <Outlet />;
}
