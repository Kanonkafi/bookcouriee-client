import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const LibrarianRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (user && user.role === "librarian") return children;

  return <Navigate to="/dashboard" replace />;
};

export default LibrarianRoute;
