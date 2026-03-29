import { google } from "googleapis";
import { getOAuthClient } from "../config/googleAuth.js";
import { parseEmail } from "../utils/emailParser.js";

export async function fetchEmailsFromGmail() {

  const auth = getOAuthClient();

  const gmail = google.gmail({
    version: "v1",
    auth
  });

  const response =
    await gmail.users.messages.list({
      userId: "me",
      maxResults: 20
    });

  const messages =
    response.data.messages || [];

  const emails = [];

  for (const msg of messages) {

    const full =
      await gmail.users.messages.get({
        userId: "me",
        id: msg.id
      });

    const parsed =
      parseEmail(full.data);

    emails.push(parsed);
  }

  return emails;
}