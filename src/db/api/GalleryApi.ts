import { supabase } from "../utils/supabaseClient";
import type { Tables, TablesInsert, TablesUpdate } from "../helpers/database.types";

export type Project = Tables<"gallery">;
type ProjectInsert = TablesInsert<"gallery">;
type ProjectUpdate = TablesUpdate<"gallery">;

export async function getGallery() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createGallery(project: ProjectInsert) {
  const { data, error } = await supabase.from("gallery").insert(project).select().single();

  if (error) throw error;
  return data;
}

export async function updateGallery(id: Project["id"], changes: ProjectUpdate) {
  const { data, error } = await supabase
    .from("gallery")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGallery(id: Project["id"]) {
  const { data, error } = await supabase.from("gallery").delete().eq("id", id).select();

  if (error) throw error;
  if (data.length === 0) {
    throw new Error(
      "Nothing was deleted. The project doesn't exist or you're not allowed to delete it.",
    );
  }
}
