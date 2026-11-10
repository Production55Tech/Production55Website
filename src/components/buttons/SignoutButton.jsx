import { useNavigate } from "react-router-dom";
import { authService } from "../../db/services/userAuthServices";
import { LogOut } from "lucide-react";

export default function SignOutButton({ className = "", size = "" }) {
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await authService.signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button type="button" className={className} onClick={signOut}>
      <LogOut size={size} />
    </button>
  );
}
