import { supabase } from "../utils/supabaseClient";
import type { Tables, TablesInsert, TablesUpdate } from "../helpers/database.types";

export type Crew = Tables<"crew">;
type CrewInsert = TablesInsert<"crew">;
type CrewUpdate = TablesUpdate<"crew">;

export async function getCrew() {
  const { data, error } = await supabase
    .from("crew")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCrew(crew: CrewInsert) {
  const { data, error } = await supabase.from("crew").insert(crew).select().single();

  if (error) throw error;
  return data;
}

export async function updateCrew(id: Crew["id"], changes: CrewUpdate) {
  const { data, error } = await supabase
    .from("crew")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCrew(id: Crew["id"]) {
  const { data, error } = await supabase.from("crew").delete().eq("id", id).select();

  if (error) throw error;
  if (data.length === 0) {
    throw new Error(
      "Nothing was deleted. The crew member doesn't exist or you're not allowed to delete it.",
    );
  }
}