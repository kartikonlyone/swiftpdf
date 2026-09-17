// Google Analytics 4 Data API client. Requires a GA4 property + a service
// account with "Viewer" access granted on that property.
//
// This calls the real GA4 Data API (runReport) — it never invents numbers.
// If not configured, callers should render the "Not Connected" admin state.

function isConfigured() {
  return Boolean(process.env.GA4_PROPERTY_ID && process.env.GA4_SERVICE_ACCOUNT_JSON);
}

export function ga4Status() {
  return { configured: isConfigured() };
}

async function getAccessToken() {
  const credentials = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON);
  const jwt = await import("jsonwebtoken").then((m) => m.default).catch(() => null);
  if (!jwt) throw new Error("jsonwebtoken is required for GA4 service-account auth. Add it to package.json.");

  const now = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    {
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
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
  if (!res.ok) throw new Error("Failed to obtain GA4 access token.");
  const data = await res.json();
  return data.access_token;
}

/**
 * @param {object} options
 * @param {string} options.startDate - "7daysAgo" | "YYYY-MM-DD"
 * @param {string} options.endDate - "today" | "YYYY-MM-DD"
 * @param {string[]} options.metrics - e.g. ["activeUsers", "screenPageViews"]
 * @param {string[]} [options.dimensions] - e.g. ["date"]
 */
export async function runReport({ startDate, endDate, metrics, dimensions = [] }) {
  if (!isConfigured()) throw new Error("GA4 is not connected.");

  const accessToken = await getAccessToken();
  const propertyId = process.env.GA4_PROPERTY_ID;

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: metrics.map((name) => ({ name })),
        dimensions: dimensions.map((name) => ({ name }))
      })
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GA4 API error (${res.status}): ${detail}`);
  }

  return res.json();
}
