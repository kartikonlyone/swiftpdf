// Google Search Console API client (Search Analytics: query).
// Requires a verified property + a service account granted access in GSC.

function isConfigured() {
  return Boolean(process.env.GSC_SITE_URL && process.env.GSC_SERVICE_ACCOUNT_JSON);
}

export function searchConsoleStatus() {
  return { configured: isConfigured() };
}

async function getAccessToken() {
  const credentials = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
  const jwtLib = await import("jsonwebtoken").then((m) => m.default).catch(() => null);
  if (!jwtLib) throw new Error("jsonwebtoken is required for GSC service-account auth.");

  const now = Math.floor(Date.now() / 1000);
  const token = jwtLib.sign(
    {
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    },
    credentials.private_key,
    { algorithm: "RS256" }
  );

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: token
    })
  });
  if (!res.ok) throw new Error("Failed to obtain Search Console access token.");
  return (await res.json()).access_token;
}

export async function queryVisibilityData({ startDate, endDate, dimensions = ["query"], rowLimit = 25 }) {
  if (!isConfigured()) throw new Error("Search Console is not connected.");

  const accessToken = await getAccessToken();
  const siteUrl = encodeURIComponent(process.env.GSC_SITE_URL);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit })
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Search Console API error (${res.status}): ${detail}`);
  }

  return res.json();
}
