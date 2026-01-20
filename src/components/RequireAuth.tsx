import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RequireAuth() {
    const { isAuthenticated, accessToken } = useAuthStore();
    const location = useLocation();

    // Check if authenticated (store state + token existence)
    if (!isAuthenticated || !accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
