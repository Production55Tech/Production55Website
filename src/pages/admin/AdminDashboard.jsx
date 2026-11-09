import { Navigate } from "react-router-dom";
import { useAuth } from "../../db/authContext";

export default function AdminDashboard() {
  const userLoggedIn = useAuth();

  return (
    <div>
      {!userLoggedIn && <Navigate to={"/admin-login"} replace={true} />}
      <div className="w-full h-dvh bg-black"></div>
    </div>
  );
}
