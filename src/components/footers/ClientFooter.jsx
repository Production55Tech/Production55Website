import { MapPin, Mail } from "lucide-react";
import SocialMediaIcon from "../buttons/SocialMediaIconButtons";
import HighlightHoverImage from "../../components/HighlightHoverImage";
import BlackVisuals from "../../assets/visuals/visuals-black.png";
import WhiteVisuals from "../../assets/visuals/visuals-white.png";
import PinkVisuals from "../../assets/visuals/visuals-pink.png";
import { NavLink } from "react-router-dom";

export default function MainFooter() {
  return (
    <footer className="relative w-full h-full">
      <div className="flex flex-row h-full gap-6 content-center">
        <div className="basis-1/5">
          <HighlightHoverImage
            className="h-full w-full object-none"
            baseSrc={WhiteVisuals}
            glowSrc={PinkVisuals}
          />
        </div>
        <div className="basis-1/5 flex justify-center">
          <div className="flex flex-col gap-4 pt-[3vh]">
            <div className="text-prod-pink text-2xl text-left uppercase">Production 55 | Cebu</div>
            <div className="flex flex-row gap-2 items-center">
              <MapPin className="w-[3vw] h-[3vh]" />
              <div>Mandaue City, Cebu Philippines 6014</div>
            </div>
            <div className="text-prod-pink text-2xl text-left uppercase">
              Production 55 | Singapore
            </div>
            <div className="flex flex-row gap-2 items-center">
              <MapPin className="w-[3vw] h-[3vh]" />
              <div>106 Bukit Teresa Road, Bukit Merah, Singapore 099745</div>
            </div>
          </div>
        </div>
        {/* socmed icons/link */}
        <div className="basis-1/5 flex justify-center">
          <div className="flex flex-col gap-4 pt-[3vh]">
            <div className="text-prod-pink text-2xl text-left uppercase">Find us on</div>
            <div className="flex flex-col gap-6">
              <SocialMediaIcon iconType={"facebook"} />
              <SocialMediaIcon iconType={"instagram"} />
            </div>
          </div>
        </div>
        <div className="basis-1/5 flex justify-center">
          <div className="flex flex-col gap-4 pt-[3vh]">
            <div className="text-prod-pink text-2xl text-left uppercase">Contact Us</div>
            <div className="flex flex-row gap-2 items-center">
              <Mail className="w-[3vw] h-[3vh]" />
              <div>hello@prod55.com</div>
            </div>
            <NavLink to="/contact" className="flex flex-row gap-2 items-center">
              <Mail className="w-[3vw] h-[3vh]" />
              <div>Contact</div>
            </NavLink>
          </div>
        </div>
        <div className="basis-1/5"></div>
      </div>

      {/* copyright thingy */}
      <div className="flex flex-row w-full h-[4vh] gap-6 items-center">
        <div className="basis-1/5"></div>
        <div className="basis-3/5 font-prodFont text-center text-sm text-neutral-500">
          Copyright (c) 2026 ibutang pani nako diri? gi suon ra nako ang og nga website. All Rights
          Reserved.
        </div>
        <div className="basis-1/5">
          <HighlightHoverImage
            className="h-full w-full object-cover"
            baseSrc={WhiteVisuals}
            glowSrc={PinkVisuals}
          />
        </div>
      </div>
    </footer>
  );
}
