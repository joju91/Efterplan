const cardsEl = document.getElementById("cards");
const kpiCardsEl = document.getElementById("kpiCards");
const kpiMetaEl = document.getElementById("kpiMeta");
const pagesTable = document.getElementById("pagesTable");
const eventsTable = document.getElementById("eventsTable");
const daysSelect = document.getElementById("daysSelect");
const statusEl = document.getElementById("status");

let chart;

function fmtInt(n) {
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n || 0);
}

function fmtPct(n) {
  return `${(Number(n || 0) * 100).toFixed(1)}%`;
}

function fmtSek(n) {
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n || 0)} kr`;
}

function setStatus(message = "") {
  statusEl.textContent = message;
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Kunde inte hamta data");
  }
  return data;
}

function renderCards(metrics) {
  const items = [
    { label: "Sessioner", value: fmtInt(metrics.sessions) },
    { label: "Anvandare", value: fmtInt(metrics.totalUsers) },
    { label: "Nya anvandare", value: fmtInt(metrics.newUsers) },
    { label: "Sidvisningar", value: fmtInt(metrics.pageViews) },
    { label: "Engagemang", value: fmtPct(metrics.engagementRate) }
  ];

  cardsEl.innerHTML = items
    .map((item) => `<article class="card"><h3>${item.label}</h3><p>${item.value}</p></article>`)
    .join("");
}

function renderKpis(payload) {
  const kpis = payload.kpis || {};
  const assumptions = payload.assumptions || {};

  const items = [
    { label: "Conversion", value: fmtPct(kpis.conversionRate), meta: assumptions.conversion || "-" },
    { label: "Trafik", value: fmtInt(kpis.trafficSessions), meta: "Sessioner" },
    { label: "Intakt", value: fmtSek(kpis.revenueSek), meta: assumptions.revenue || "-" },
    { label: "Leads", value: fmtInt(kpis.leads), meta: assumptions.leads || "-" }
  ];

  kpiCardsEl.innerHTML = items
    .map((item) => {
      return `<article class="card kpi-card"><h3>${item.label}</h3><p>${item.value}</p><small>${item.meta}</small></article>`;
    })
    .join("");

  const estimated = kpis.usesEstimatedRevenue ? "Ja" : "Nej";
  const price = assumptions.paidPriceSek ? `${fmtSek(assumptions.paidPriceSek)} per kop` : "-";
  kpiMetaEl.textContent = `Intakt estimerad: ${estimated}. Prisantagande: ${price}.`;
}

function renderTable(el, rows, cols) {
  el.innerHTML = rows
    .map((row) => {
      const tds = cols.map((c) => `<td>${c.format ? c.format(row[c.key]) : row[c.key]}</td>`).join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");
}

function renderChart(points) {
  const labels = points.map((p) => {
    const date = String(p.date || "");
    return `${date.slice(6, 8)}/${date.slice(4, 6)}`;
  });

  const sessions = points.map((p) => p.sessions || 0);
  const pageViews = points.map((p) => p.pageViews || 0);

  const ctx = document.getElementById("trafficChart");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Sessioner",
          data: sessions,
          borderColor: "#0e63ff",
          backgroundColor: "rgba(14, 99, 255, 0.15)",
          tension: 0.3,
          fill: true
        },
        {
          label: "Sidvisningar",
          data: pageViews,
          borderColor: "#15b0a6",
          backgroundColor: "rgba(21, 176, 166, 0.1)",
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

async function loadDashboard() {
  try {
    setStatus("");
    const days = Number(daysSelect.value || 30);

    const [overview, kpiPayload, timeseries, pages, events] = await Promise.all([
      fetchJson(`/api/overview?days=${days}`),
      fetchJson(`/api/kpis?days=${days}`),
      fetchJson(`/api/timeseries?days=${days}`),
      fetchJson(`/api/pages?days=${days}&limit=10`),
      fetchJson(`/api/events?days=${days}&limit=10`)
    ]);

    renderCards(overview.metrics);
    renderKpis(kpiPayload);
    renderChart(timeseries.points || []);

    renderTable(pagesTable, pages.rows || [], [
      { key: "pagePath" },
      { key: "pageViews", format: fmtInt },
      { key: "sessions", format: fmtInt }
    ]);

    renderTable(eventsTable, events.rows || [], [
      { key: "eventName" },
      { key: "eventCount", format: fmtInt },
      { key: "users", format: fmtInt }
    ]);
  } catch (error) {
    console.error(error);
    setStatus(`Fel: ${error.message}`);
  }
}

daysSelect.addEventListener("change", loadDashboard);
loadDashboard();
