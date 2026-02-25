import { google } from "googleapis";
import { getOAuthClient } from "../config/googleAuth.js";

export async function fetchEmailsFromGmail() {
  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
  });

  const list = await gmail.users.messages.list({
    userId: "me",
    maxResults: 20
  });

  const messages = list.data.messages || [];

  return Promise.all(
    messages.map(async ({ id }) => {
      const email = await gmail.users.messages.get({
        userId: "me",
        id,
        format: "full"
      });

      const headers = email.data.payload.headers;

      return {
        id,
        thread_id: email.data.threadId,
        sender:
          headers.find(h => h.name === "From")?.value || "",
        subject:
          headers.find(h => h.name === "Subject")?.value || "",
        snippet: email.data.snippet,
        raw_payload: email.data.payload,
        internal_date: email.data.internalDate
      };
    })
  );
}
