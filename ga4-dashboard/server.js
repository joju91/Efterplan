require("dotenv").config();
const path = require("path");
const express = require("express");
const { google } = require("googleapis");

const app = express();
const port = Number(process.env.PORT || 8787);
const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  console.warn("Missing GA4_PROPERTY_ID in environment.");
}

function buildAnalyticsClient() {
  const scopes = ["https://www.googleapis.com/auth/analytics.readonly"];

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const auth = new google.auth.GoogleAuth({
      scopes,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    return google.analyticsdata({ version: "v1beta", auth });
  }

  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
      },
      scopes
    });
    return google.analyticsdata({ version: "v1beta", auth });
  }

  throw new Error(
    "No Google credentials configured. Use GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY."
  );
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeDays(value) {
  const days = Number(value || 30);
  if (!Number.isFinite(days)) return 30;
  return Math.min(Math.max(Math.floor(days), 1), 365);
}

async function runReport({ days, dimensions = [], metrics = [], orderBys = [], limit, dimensionFilter }) {
  const analyticsData = buildAnalyticsClient();
  const requestBody = {
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    metrics,
    dimensions
  };

  if (orderBys.length) requestBody.orderBys = orderBys;
  if (limit) requestBody.limit = String(limit);
  if (dimensionFilter) requestBody.dimensionFilter = dimensionFilter;

  const response = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody
  });

  return response.data;
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, propertyId: propertyId || null });
});

app.get("/api/overview", async (req, res) => {
  try {
    if (!propertyId) {
      return res.status(400).json({ error: "GA4_PROPERTY_ID is missing in .env" });
    }

    const days = normalizeDays(req.query.days);
    const report = await runReport({
      days,
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "newUsers" },
        { name: "screenPageViews" },
        { name: "engagementRate" }
      ]
    });

    const row = report.rows?.[0]?.metricValues || [];

    return res.json({
      days,
      metrics: {
        sessions: toNumber(row[0]?.value),
        totalUsers: toNumber(row[1]?.value),
        newUsers: toNumber(row[2]?.value),
        pageViews: toNumber(row[3]?.value),
        engagementRate: toNumber(row[4]?.value)
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      details: error.errors || null
    });
  }
});

app.get("/api/timeseries", async (req, res) => {
  try {
    if (!propertyId) {
      return res.status(400).json({ error: "GA4_PROPERTY_ID is missing in .env" });
    }

    const days = normalizeDays(req.query.days);
    const report = await runReport({
      days,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }]
    });

    const points = (report.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value,
      sessions: toNumber(row.metricValues?.[0]?.value),
      pageViews: toNumber(row.metricValues?.[1]?.value)
    }));

    return res.json({ days, points });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      details: error.errors || null
    });
  }
});

app.get("/api/pages", async (req, res) => {
  try {
    if (!propertyId) {
      return res.status(400).json({ error: "GA4_PROPERTY_ID is missing in .env" });
    }

    const days = normalizeDays(req.query.days);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);

    const report = await runReport({
      days,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit
    });

    const rows = (report.rows || []).map((row) => ({
      pagePath: row.dimensionValues?.[0]?.value || "(okand)",
      pageViews: toNumber(row.metricValues?.[0]?.value),
      sessions: toNumber(row.metricValues?.[1]?.value)
    }));

    return res.json({ days, rows });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      details: error.errors || null
    });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    if (!propertyId) {
      return res.status(400).json({ error: "GA4_PROPERTY_ID is missing in .env" });
    }

    const days = normalizeDays(req.query.days);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);

    const report = await runReport({
      days,
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit
    });

    const rows = (report.rows || []).map((row) => ({
      eventName: row.dimensionValues?.[0]?.value || "(okand)",
      eventCount: toNumber(row.metricValues?.[0]?.value),
      users: toNumber(row.metricValues?.[1]?.value)
    }));

    return res.json({ days, rows });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      details: error.errors || null
    });
  }
});

app.get("/api/kpis", async (req, res) => {
  try {
    if (!propertyId) {
      return res.status(400).json({ error: "GA4_PROPERTY_ID is missing in .env" });
    }

    const days = normalizeDays(req.query.days);
    const priceSek = Math.max(Number(process.env.PAID_PRICE_SEK || 149), 0);

    const trackedEvents = [
      "Plan Generated",
      "Plan Completed",
      "Paywall CTA Clicked",
      "Purchase",
      "purchase",
      "paywall_hit",
      "step_complete",
      "Task Complete",
      "Lead Submitted",
      "lead_generated"
    ];

    const [trafficReport, eventReport, revenueReport] = await Promise.all([
      runReport({
        days,
        metrics: [{ name: "sessions" }]
      }),
      runReport({
        days,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: trackedEvents
            }
          }
        },
        limit: trackedEvents.length
      }),
      runReport({
        days,
        metrics: [{ name: "purchaseRevenue" }]
      })
    ]);

    const sessions = toNumber(trafficReport.rows?.[0]?.metricValues?.[0]?.value);
    const purchaseRevenue = toNumber(revenueReport.rows?.[0]?.metricValues?.[0]?.value);

    const events = {};
    for (const name of trackedEvents) events[name] = 0;
    for (const row of eventReport.rows || []) {
      const name = row.dimensionValues?.[0]?.value || "";
      events[name] = toNumber(row.metricValues?.[0]?.value);
    }

    const completed = events["Plan Completed"];
    const generated = events["Plan Generated"];
    const paywallHits = events["Paywall CTA Clicked"] + events.paywall_hit;
    const leads = events["Lead Submitted"] + events.lead_generated + paywallHits;
    const purchases = events.Purchase + events.purchase;
    const conversionRate = generated > 0 ? completed / generated : 0;

    const estimatedRevenue = purchases * priceSek;
    const revenueSek = purchaseRevenue > 0 ? purchaseRevenue : estimatedRevenue;

    return res.json({
      days,
      assumptions: {
        paidPriceSek: priceSek,
        conversion: "Plan Completed / Plan Generated",
        leads: "Lead Submitted + lead_generated + Paywall CTA Clicked + paywall_hit",
        revenue: purchaseRevenue > 0 ? "GA4 purchaseRevenue" : `Purchases x ${priceSek} SEK (estimate)`
      },
      events,
      kpis: {
        trafficSessions: sessions,
        conversionRate,
        leads,
        purchases,
        revenueSek,
        usesEstimatedRevenue: purchaseRevenue <= 0
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      details: error.errors || null
    });
  }
});

app.listen(port, () => {
  console.log(`GA4 dashboard running on http://localhost:${port}`);
});
