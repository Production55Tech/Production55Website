import AdminHeader from "../headers/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminPageLayout() {
  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
}
