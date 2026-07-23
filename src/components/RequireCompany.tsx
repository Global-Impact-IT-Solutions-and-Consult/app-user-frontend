import { Navigate, Outlet } from "react-router-dom";
import { useCompanyStore } from "../store/companyStore";

export default function RequireCompany() {
    const { companies } = useCompanyStore();

    if (!companies || companies.length < 1) {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
}
