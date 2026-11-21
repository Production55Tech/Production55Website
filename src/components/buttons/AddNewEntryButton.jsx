import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddNewEntryButton() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const showOptions = () => {
    setIsClicked(!isClicked);
  };

  const addNewEntry = () => {
    navigate("/admin/create-entry", { replace: true });
  };

  return (
    <button
      className={`z-50 absolute bottom-10 right-10 w-15 h-15 bg-prod-pink text-white rounded-lg transition-transform cursor-pointer ${isClicked ? "scale-120" : "hover:scale-110"}`}
      onClick={showOptions}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isClicked ? (
          <>
            <div className="z-50 absolute bottom-19 right-0 text-right w-[8vw] text-prod-pink select-none cursor-default">
              <div className="flex flex-col gap-2">
                <div>
                  <div className="cursor-pointer">New Project?</div>
                </div>
                <div>New Crew?</div>
                <div>New Equipment?</div>
              </div>
            </div>
            <Plus className="absolute h-10 w-10 transition-all duration-300 transform rotate-180 scale-0 opacity-0" />
            <X className="absolute h-10 w-10 transition-all duration-300 transform-rotate-0 scale-100 opacity-100" />
          </>
        ) : (
          <>
            <Plus className="absolute h-10 w-10 transition-all duration-300 transform rotate-0 scale-100 opacity-100" />
            <X className="absolute h-10 w-10 transition-all duration-300 transform-rotate-180 scale-0 opacity-0" />
          </>
        )}
      </div>
    </button>
  );
}
