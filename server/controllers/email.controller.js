import { fetchEmailsFromGmail } from "../services/gmail.service.js";

import {
	syncEmails,
	getDashboardEmails,
	getEmailById,
	searchEmails
} from "../services/database.service.js";

import { extractBody } from "../utils/emailParser.js";

/* =====================
   EMAIL BODY
===================== */

export async function getEmailBody(req, res) {
	res.json({
		message: "Body loading disabled for now"
	});
}

/* =====================
   SYNC EMAILS
===================== */

export async function syncEmailsController(req, res) {
	try {
		console.log("Syncing Gmail...");

		const emails = await fetchEmailsFromGmail();

		console.log("Fetched:", emails.length);

		await syncEmails(emails);

		console.log("Synced with Supabase");

		res.json({
			message: "Emails synced",
			count: emails.length
		});
	} catch (err) {
		console.error(err);

		res.status(500).json({
			error: "Sync failed"
		});
	}
}

/* =====================
   DASHBOARD
===================== */

export async function dashboard(req, res) {
	try {
		console.log("Loading dashboard...");

		const data = await getDashboardEmails();

		res.json(data);
	} catch (err) {
		console.error(err);

		res.status(500).json({
			error: "Dashboard failed"
		});
	}
}

export async function searchBySender(req, res) {
	try {
		const { sender } = req.query;

		console.log("Searching for:", sender);

		const results = await searchEmails(sender);

		res.json(results);
	} catch (err) {
		console.error(err);

		res.status(500).json({
			error: "Search failed"
		});
	}
}

export async function getStats(req, res) {
	try {
		const data = await getDashboardEmails();

		const count = data.length;

		const lastMail = data[0]?.gmail_internal_date || null;

		res.json({
			count,
			lastMail
		});
	} catch (err) {
		console.error(err);

		res.status(500).json({
			error: "Stats failed"
		});
	}
}

export async function advancedSearch(req, res) {

try {

const filters = req.body;

const data =
await advancedQuery(filters);

res.json(data);

} catch (err) {

console.error(err);

res.status(500).json({
error: "Advanced search failed"
});

}
}