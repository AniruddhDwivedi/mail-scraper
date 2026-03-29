function decodeBase64URL(data) {
  if (!data) return "";

  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");

  return Buffer.from(base64, "base64").toString("utf-8");
}

function findBody(payload) {
  if (!payload) return "";

  if (payload.body?.data) return decodeBase64URL(payload.body.data);

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain")
        return decodeBase64URL(part.body.data);

      if (part.mimeType === "text/html") return decodeBase64URL(part.body.data);

      if (part.parts) return findBody(part);
    }
  }

  return "";
}

/* =====================
   NEW PARSER FUNCTION
===================== */

export function parseEmail(message) {
  const headers = message.payload.headers;

  const subject = headers.find((h) => h.name === "Subject")?.value || "";

  const sender = headers.find((h) => h.name === "From")?.value || "";

  return {
    id: message.id,
    sender,
    subject,
    snippet: message.snippet || "",
    gmail_internal_date: Number(message.internalDate),
    raw_payload: message.payload
  };
}

/* =====================
   BODY EXTRACTOR
===================== */

export function extractBody(payload) {
  return findBody(payload);
}
