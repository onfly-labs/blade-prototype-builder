import { supabase } from "@/integrations/supabase/client";

export interface Rule {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export const fetchRules = async (): Promise<Rule[]> => {
  const { data, error } = await supabase
    .from("approval_rules")
    .select("id, name, description, active")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createRule = async (name: string, description: string): Promise<Rule> => {
  const { data, error } = await supabase
    .from("approval_rules")
    .insert({ name, description, active: true })
    .select("id, name, description, active")
    .single();
  if (error) throw error;
  return data;
};

export const updateRule = async (id: string, updates: Partial<Pick<Rule, "name" | "description" | "active">>): Promise<void> => {
  const { error } = await supabase
    .from("approval_rules")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
};

export const deleteRule = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("approval_rules")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

export const getActiveRules = async (): Promise<Rule[]> => {
  const { data, error } = await supabase
    .from("approval_rules")
    .select("id, name, description, active")
    .eq("active", true);
  if (error) throw error;
  return data ?? [];
};
