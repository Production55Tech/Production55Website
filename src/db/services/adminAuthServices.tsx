import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { authService, isSuperAdmin } from "./userAuthServices";

export function RequireAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
    return authService.onAuthStateChange(setUser);
  }, []);

  if (loading) return null;
  return isSuperAdmin(user) ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
