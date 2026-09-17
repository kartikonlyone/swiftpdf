// Google AdSense Management API client (read-only reporting).
// Requires OAuth2/service-account access to the AdSense account.

function isConfigured() {
  return Boolean(process.env.ADSENSE_ACCOUNT_ID && process.env.ADSENSE_SERVICE_ACCOUNT_JSON);
}

export function adsenseStatus() {
  return {
    configured: isConfigured(),
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null
  };
}

async function getAccessToken() {
  const credentials = JSON.parse(process.env.ADSENSE_SERVICE_ACCOUNT_JSON);
  const jwtLib = await import("jsonwebtoken").then((m) => m.default).catch(() => null);
  if (!jwtLib) throw new Error("jsonwebtoken is required for AdSense service-account auth.");

  const now = Math.floor(Date.now() / 1000);
  const token = jwtLib.sign(
    {
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/adsense.readonly",
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
  if (!res.ok) throw new Error("Failed to obtain AdSense access token.");
  return (await res.json()).access_token;
}

export async function getEarningsReport({ startDate, endDate }) {
  if (!isConfigured()) throw new Error("AdSense is not connected.");

  const accessToken = await getAccessToken();
  const accountId = process.env.ADSENSE_ACCOUNT_ID;

  const params = new URLSearchParams({
    "dateRange": "CUSTOM",
    "startDate.year": startDate.year,
    "startDate.month": startDate.month,
    "startDate.day": startDate.day,
    "endDate.year": endDate.year,
    "endDate.month": endDate.month,
    "endDate.day": endDate.day,
    "metrics": "ESTIMATED_EARNINGS,IMPRESSIONS,CLICKS,IMPRESSIONS_CTR,PAGE_VIEWS_RPM,AD_REQUESTS"
  });

  const res = await fetch(
    `https://adsense.googleapis.com/v2/accounts/${accountId}/reports:generate?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`AdSense API error (${res.status}): ${detail}`);
  }

  return res.json();
}
