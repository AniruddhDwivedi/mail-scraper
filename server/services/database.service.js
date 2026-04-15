import supabase from "../config/supabaseClient.js";

export async function searchEmails(sender) {
  console.log("Searching for:", sender);

  const { data: allData } = await supabase
    .from("emails")
    .select("sender")
    .limit(10);

  console.log("Sample senders:", allData);

  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .ilike("sender", `%${sender.trim()}%`);

  if (error) throw error;

  return data;
}

export async function syncEmails(emailData) {
  const gmailIds = emailData.map((e) => e.id);

  // UPSERT
  const { error: upsertError } = await supabase
    .from("emails")
    .upsert(emailData);

  if (upsertError) throw upsertError;

  // DELETE missing
  const { error: deleteError } = await supabase
    .from("emails")
    .delete()
    .not("id", "in", `(${gmailIds.join(",")})`);

  if (deleteError) throw deleteError;

  console.log("Synced emails:", emailData.length);
}

export async function getDashboardEmails() {
  const { data, error } = await supabase
    .from("emails")
    .select(
      `
        id,
        sender,
        subject,
        snippet,
        gmail_internal_date
      `
    )
    .order("gmail_internal_date", {
      ascending: false
    })
    .limit(50);

  if (error) {
    console.log("Supabase URL:", process.env.SUPABASE_URL);
  }

  return data;
}

export async function getEmailById(id) {
  const { data, error } = await supabase
    .from("emails")
    .select("id, raw_payload")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function advancedQuery(filters) {
  let query = supabase.from("emails").select("*");

  if (filters.keyword) {
    query = query.ilike("subject", `%${filters.keyword}%`);
  }

  if (filters.startDate) {
    query = query.gte("created_at", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("created_at", filters.endDate);
  }

  if (filters.recentSenders) {
    query = query.order("gmail_internal_date", { ascending: false });
  }

  if (filters.senderFrequency) {
    const { data, error } = await supabase.from("emails").select("sender");

    const counts = {};

    data.forEach((mail) => {
      counts[mail.sender] = (counts[mail.sender] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }

  const { data, error } = await query.limit(50);

  if (error) throw error;

  return data;
}
