function decodeBase64URL(data) {
  if (!data) return "";

  const base64 = data
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  return Buffer
    .from(base64, "base64")
    .toString("utf-8");
}

function findBody(payload) {

  if (!payload) return "";

  // simple email
  if (payload.body?.data)
    return decodeBase64URL(payload.body.data);

  // multipart email
  if (payload.parts) {
    for (const part of payload.parts) {

      if (part.mimeType === "text/plain")
        return decodeBase64URL(part.body.data);

      if (part.mimeType === "text/html")
        return decodeBase64URL(part.body.data);

      if (part.parts)
        return findBody(part);
    }
  }

  return "";
}

export function extractBody(payload) {
  return findBody(payload);
}