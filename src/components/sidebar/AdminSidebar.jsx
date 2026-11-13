import { useState } from "react";
import SignOutButton from "../buttons/SignoutButton";
import ProdLogoWhite from "../../assets/logos/prod55-white.png";
import { Camera, Images, UserGroup } from "lucide-react";

export default function AdminSidebar({ value = "" }) {
  const [currentSelectedPage, setCurrentSelectedPage] = useState(value || "gallery");
  const isSidebarOpen = useState(false);

  return (
    <div className="left-0 w-[5%] grid grid-rows-[4rem_auto_4rem] h-full justify-stretch">
      <div className="">
        <img src={ProdLogoWhite} className="w-[4.5dvw] p-3 mx-auto" />
      </div>
      <div className="flex flex-col justify-center gap-5">
        {currentSelectedPage === "gallery" ? (
          <div className="mx-auto p-3 bg-white rounded-lg" title="Gallery">
            <Images className="mx-auto stroke-prod-pink" size={35} />
          </div>
        ) : (
          <div
            title="Gallery"
            className="mx-auto p-3 rounded-lg transition-colors ease-in-out duration-300 hover:bg-[#262626]"
            onClick={() => setCurrentSelectedPage("gallery")}
          >
            <Images className="mx-auto" size={35} />
          </div>
        )}
        {currentSelectedPage === "crew" ? (
          <div className="mx-auto p-3 bg-white rounded-lg" title="Crew">
            <UserGroup className="mx-auto stroke-prod-pink" size={35} />
          </div>
        ) : (
          <div
            title="Crew"
            className="mx-auto p-3 rounded-lg transition-colors ease-in-out duration-300 hover:bg-[#262626]"
            onClick={() => setCurrentSelectedPage("crew")}
          >
            <UserGroup className="mx-auto" size={35} />
          </div>
        )}
        {currentSelectedPage === "equipment" ? (
          <div className="mx-auto p-3 bg-white rounded-lg" title="Equipment">
            <Camera className="mx-auto stroke-prod-pink" size={35} />
          </div>
        ) : (
          <div
            title="Equipment"
            className="mx-auto p-3 rounded-lg transition-colors ease-in-out duration-300 hover:bg-[#262626]"
            onClick={() => setCurrentSelectedPage("equipment")}
          >
            <Camera className="mx-auto" size={35} />
          </div>
        )}
      </div>
      <div title="byebye? :(" className="mx-auto pb-4">
        <SignOutButton
          size={35}
          className="p-3 rounded-lg transition-colors ease-in-out duration-300 hover:text-red-500 hover:bg-[#262626]"
        />
      </div>
    </div>
  );
}
