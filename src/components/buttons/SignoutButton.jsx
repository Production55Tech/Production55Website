import { useNavigate } from "react-router-dom";
import { authService } from "../../db/services/userAuthServices";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function SignOutButton({ className = "", size = "" }) {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    try {
      await authService.signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setIsSigningOut(true)}
        title="byebye? :("
      >
        <LogOut size={size} />
      </button>
      {isSigningOut && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsSigningOut(false)}
        >
          <div
            className="bg-white/95 backdrop-blur p-6 rounded-lg text-center min-w-[4vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-medium text-gray-900 mb-4">
              Are you sure you want to sign out? <span className="text-prod-pink">:(</span>
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={signOut}
                className="px-4 py-2 bg-white text-prod-pink border-2 border-prod-pink rounded-lg hover:bg-red-500 hover:border-white hover:text-white transition-colors"
              >
                Yes, byebye!
              </button>
              <button
                onClick={() => setIsSigningOut(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
