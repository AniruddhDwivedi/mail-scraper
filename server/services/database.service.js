import supabase from "../config/supabaseClient.js";

export async function storeEmails(emails) {
  const { error } =
    await supabase.from("emails").upsert(emails);

  if (error) throw error;
}

export async function getDashboardEmails() {
  const { data, error } =
    await supabase.from("emails").select("*").limit(50);

  if (error) throw error;

  return data;
}

export async function syncEmails(emailData) {

  const gmailIds = emailData.map(e => e.id);

  // UPSERT current emails
  const { error: upsertError } =
    await supabase
      .from("emails")
      .upsert(emailData);

  if (upsertError) throw upsertError;

  // DELETE missing emails
  const { error: deleteError } =
    await supabase
      .from("emails")
      .delete()
      .not("id", "in", `(${gmailIds.join(",")})`);

  if (deleteError) throw deleteError;
}

export async function getEmailById(id) {

  const { data, error } =
    await supabase
      .from("emails")
      .select("id, raw_payload")
      .eq("id", id)
      .single();

  if (error) throw error;

  return data;
}