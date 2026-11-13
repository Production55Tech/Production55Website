import AdminSidebar from "../sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminPageLayout() {
  return (
    <>
      <div className="w-screen h-screen flex flex-row">
        <AdminSidebar value="gallery" />
        <Outlet />
      </div>
    </>
  );
}
