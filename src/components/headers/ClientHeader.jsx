import { NavLink, Link, Outlet } from "react-router-dom";
import Logo from "../../assets/logos/prod55-white.png";
import LogoPink from "../../assets/logos/prod55-pink.png";

export default function ClientHeader() {
  return (
    <header className="fixed top-0 z-50 pointer-events-none bg-linear-to-b from-black to-transparent w-full overflow-x-hidden mix-blend-exclusion">
      <div className="grid grid-cols-8 pointer-events-auto">
        <div className="flex justify-center my-auto pointer-events-auto">
          <NavLink
            to="/crew"

            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-prod-pink" : "text-gray-300 hover:text-white"}`
            }
          >
            CREW
          </NavLink>
        </div>

        <div className="flex justify-center my-auto pointer-events-auto">
          <NavLink
            to="/gallery"

            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-prod-pink" : "text-gray-300 hover:text-white"}`
            }
          >
            GALLERY
          </NavLink>
        </div>
        <div className="flex col-span-4 justify-center my-auto pointer-events-auto">
          <Link to="/" className="group grid overflow-hidden aspect-video">
            <img
              src={Logo}
              className="col-start-1 row-start-1 object-contain w-[8dvw] h-[8dvh] transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src={LogoPink}
              className="col-start-1 row-start-1 object-contain w-[8dvw] h-[8dvh] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </Link>
        </div>
        <div className="flex justify-center my-auto pointer-events-auto">
          <NavLink
            to="/gears"

            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-prod-pink" : "text-gray-300 hover:text-white"}`
            }
          >
            GEARS
          </NavLink>
        </div>
        <div className="flex justify-center my-auto pointer-events-auto">
          <NavLink
            to="/contact"

            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-prod-pink" : "text-gray-300 hover:text-white"}`
            }
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </header>
  );
}
