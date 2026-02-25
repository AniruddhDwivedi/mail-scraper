import { google } from "googleapis";

let oauth2Client = null;

/* =====================
   CREATE CLIENT
===================== */

export function getOAuthClient() {
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  return oauth2Client;
}

/* =====================
   AUTH ROUTE
===================== */

export function googleAuth(req, res) {
  const client = getOAuthClient();

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly"
    ]
  });

  res.redirect(url);
}

/* =====================
   CALLBACK
===================== */

export async function googleCallback(req, res) {
  try {
    const client = getOAuthClient();

    const { code } = req.query;

    const { tokens } = await client.getToken(code);

    client.setCredentials(tokens);

    console.log("✅ Gmail Connected");

    res.redirect("http://localhost:5173/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth failed");
  }
}