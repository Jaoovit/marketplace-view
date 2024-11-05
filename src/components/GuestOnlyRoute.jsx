import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestOnlyRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default GuestOnlyRoute;
