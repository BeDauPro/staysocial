import AdminDashboard from "../../pages/Admin/AdminDashboard";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminDashboard />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}