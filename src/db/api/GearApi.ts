import { supabase } from "../utils/supabaseClient";
import type { Tables, TablesInsert, TablesUpdate } from "../helpers/database.types";

export type Gear = Tables<"gear">;
type GearInsert = TablesInsert<"gear">;
type GearUpdate = TablesUpdate<"gear">;

export async function getGear() {
  const { data, error } = await supabase
    .from("gear")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createGear(gear: GearInsert) {
  const { data, error } = await supabase.from("gear").insert(gear).select().single();

  if (error) throw error;
  return data;
}

export async function updateGear(id: Gear["id"], changes: GearUpdate) {
  const { data, error } = await supabase
    .from("gear")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGear(id: Gear["id"]) {
  const { data, error } = await supabase.from("gear").delete().eq("id", id).select();

  if (error) throw error;
  if (data.length === 0) {
    throw new Error(
      "Nothing was deleted. The gear item doesn't exist or you're not allowed to delete it.",
    );
  }
}