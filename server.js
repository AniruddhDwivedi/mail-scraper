import express from "express";
import cors from "cors";
import { google } from "googleapis";
import dotenv from "dotenv";
import { supabase } from "./server/supabaseClient.js";

dotenv.config();

const app = express();
const PORT = 3000;

/* =====================
   Middleware FIRST
===================== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* =====================
   OAuth Setup
===================== */

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function loadTokens() {
  const { data } = await supabase
    .from("gmail_tokens")
    .select("*")
    .eq("id", "default")
    .single();

  if (data) {
    oauth2Client.setCredentials(data);
  }
}

loadTokens();

/* =====================
   Auth Routes
===================== */

app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"]
  });

  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);

  await supabase.from("gmail_tokens").upsert({
    id: "default",
    ...tokens
  });

  oauth2Client.setCredentials(tokens);

  res.redirect("http://localhost:5173/dashboard");
});

/* =====================
   API ROUTE ✅
===================== */

app.get("/api/emails", async (req, res) => {
  console.log("FETCH EMAIL ROUTE HIT");
  try {
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client
    });

    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10
    });

    const messages = list.data.messages || [];

    const emailData = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id
        });

        const headers = email.data.payload.headers;

        return {
          id: msg.id,
          sender: headers.find((h) => h.name === "From")?.value || "",
          subject: headers.find((h) => h.name === "Subject")?.value || "",
          snippet: email.data.snippet
        };
      })
    );

    // ✅ INSERT INTO SUPABASE
    const { error } = await supabase.from("emails").upsert(emailData);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json(error);
    }

    res.json({
      message: "Emails saved successfully",
      count: emailData.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database insert failed"
    });
  }
});

/* =====================
   FETCH FROM DB
===================== */

app.get("/api/dashboard", async (req, res) => {

  console.log("SYNCING EMAILS");

  await fetchEmailsFromGmailAndStore(); // reuse logic

  const emails = await supabase
    .from("emails")
    .select("*");

  res.json(emails.data);
});

/* =====================
   START SERVER LAST
===================== */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
