import { supabase } from "../utils/supabaseClient";
import type { Tables, TablesInsert, TablesUpdate } from "../helpers/database.types";

export type Project = Tables<"projects">;
type ProjectInsert = TablesInsert<"projects">;
type ProjectUpdate = TablesUpdate<"projects">;

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInsert) {
  const { data, error } = await supabase.from("projects").insert(project).select().single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: Project["id"], changes: ProjectUpdate) {
  const { data, error } = await supabase
    .from("projects")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: Project["id"]) {
  const { data, error } = await supabase.from("projects").delete().eq("id", id).select();

  if (error) throw error;
  if (data.length === 0) {
    throw new Error(
      "Nothing was deleted. The project doesn't exist or you're not allowed to delete it.",
    );
  }
}
