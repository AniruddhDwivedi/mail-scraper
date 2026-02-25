import { fetchEmailsFromGmail } from "../services/gmail.service.js";

import {
	storeEmails,
	getDashboardEmails
} from "../services/database.service.js";
import { getEmailById } from "../services/database.service.js";
import { extractBody } from "../utils/emailParser.js";

export async function getEmailBody(req, res) {
  try {
    const { id } = req.params;

    const email = await getEmailById(id);

    const body = extractBody(email.raw_payload);

    res.json({
      id,
      body
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to load email"
    });
  }
}
export async function syncEmails(req, res) {
	try {
		const emails = await fetchEmailsFromGmail();
		await storeEmails(emails);

		res.json({
			message: "Emails synced",
			count: emails.length
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Sync failed" });
	}
}

export async function dashboard(req, res) {
	try {
		const data = await getDashboardEmails();
		res.json(data);
	} catch {
		res.status(500).json({ error: "Dashboard failed" });
	}
}
