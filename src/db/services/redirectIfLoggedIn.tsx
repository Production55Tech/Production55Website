import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { authService } from "../services/userAuthServices";

export default function RedirectIfAuthed() {
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
  return user ? <Navigate to="/admin/dashboard/gallery" replace /> : <Outlet />;
}
