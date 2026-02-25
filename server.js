import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

/* =====================
   OAuth Setup
===================== */

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/* =====================
   STEP 1 — Login
===================== */

app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"]
  });

  res.redirect(url);
});

/* =====================
   STEP 2 — Callback
===================== */

app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("✅ Gmail Connected");

    res.redirect("http://localhost:5173");
  } catch (err) {
    console.error(err);
    res.send("Authentication failed");
  }
});

/* =====================
   STEP 3 — Fetch Emails
===================== */

app.get("/api/emails", async (req, res) => {
  try {
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client
    });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch emails");
  }
});

/* =====================
   Server Start
===================== */

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});