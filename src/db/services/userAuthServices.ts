import type { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";

export const isSuperAdmin = (user: User | null | undefined) =>
  user?.app_metadata?.role === "super_admin";

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!isSuperAdmin(data.user)) {
      await supabase.auth.signOut();
      throw new Error("Not Authorized!!");
    }
    return data.user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(cb: (user: User | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => cb(session?.user ?? null));
    return () => subscription.unsubscribe();
  },
};
