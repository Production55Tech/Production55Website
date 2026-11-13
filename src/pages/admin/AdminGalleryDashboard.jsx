import { Plus, Search, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import { useState, useRef } from "react";
import AdminDashboardTable from "../../components/tables/AdminDashboardTable";

export default function AdminGalleryDashboard() {
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [panelHeight, setPanelHeight] = useState(0);
  const panelRef = useRef(null);

  const toggleAdvancedFilter = () => {
    setPanelHeight(showAdvancedFilters ? 0 : panelRef.current.scrollHeight);
    setShowAdvancedFilters((prev) => !prev);
  };

  const addNewEntry = () => {
    navigate("/admin/create-entry", { replace: true });
  };

  return (
    <div className="w-full h-dvh bg-black p-6">
      <div className="flex flex-col bg-[#181818] w-full h-full rounded-lg p-6 gap-6">
        {/* search thingy */}
        <div className="shrink-0">
          <div className="flex h-12 w-full gap-6">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search"
                className="h-full w-full rounded-lg border-2 border-prod-pink pl-10 pr-3 text-lg outline-none focus:ring-2 focus:ring-prod-pink/80"
              />
            </div>
            <button
              type="button"
              onClick={toggleAdvancedFilter}
              aria-pressed={showAdvancedFilters}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 transition-colors duration-300 ease-in-out ${
                showAdvancedFilters
                  ? "bg-prod-pink text-white"
                  : "bg-white text-black hover:text-prod-pink"
              }`}
            >
              <Settings2 className="pointer-events-none h-5 w-5" />
              Advanced filter
            </button>
          </div>

          <div
            ref={panelRef}
            style={{ height: panelHeight }}
            className={`mt-4 transition-all duration-300 ease-in-out ${
              showAdvancedFilters ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <div className="flex flex-col h-fit gap-6">
              <div className="grid grid-cols-4">
                <div className="mx-auto">sort by</div>
                <div className="mx-auto">sort by</div>
                <div className="mx-auto">sort by</div>
                <div className="mx-auto">sort by</div>
              </div>
              <button
                type="button"
                className="h-12 bg-prod-pink rounded-lg w-25 mx-auto transition-all hover:scale-105"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* table thingy */}
        <AdminDashboardTable />
        <div
          className="z-50 absolute bottom-10 right-10 w-15 h-15 bg-prod-pink text-white rounded-lg transition-transform hover:scale-110"
          title="Add New Entry"
          onClick={addNewEntry}
        >
          <Plus className="absolute h-10 w-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
