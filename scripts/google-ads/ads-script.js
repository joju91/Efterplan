/**
 * ============================================================
 *  Efterplan.se — Google Ads Agent Script
 * ============================================================
 *
 *  INSTALLATION (en gång):
 *  1. Öppna Google Ads → Verktyg & Inställningar →
 *     Massåtgärder → Scripts → + Nytt skript
 *  2. Klistra in hela den här filen
 *  3. Namnge skriptet "Efterplan Agent"
 *  4. Klicka "Skriptegenskaper" (kugghjulsikonen) →
 *     lägg till dessa två egenskaper:
 *       VERCEL_BASE_URL  = https://efterplan.se
 *       ADS_AGENT_SECRET = <värdet från SECRETS.md / Vercel-miljövariabeln>
 *  5. Klicka "Förhandsgranska" för att testa en gångskörning
 *  6. Spara → Schemalägg: Dagligen kl. 06:00
 *
 *  Vad skriptet gör varje dag:
 *  • Exporterar sökordsprestanda (senaste 7 dygnen) till databasen
 *  • Varje måndag: exporterar söktermsrapport (senaste 30 dygnen)
 *  • Hämtar AI-genererade optimeringsbeslut och implementerar dem
 *
 *  Skriptet ÄNDRAR ALDRIG budget eller skapar nya kampanjer —
 *  det kan bara pausa/aktivera sökord och lägga till negativa sökord.
 * ============================================================
 */

var PROPS       = PropertiesService.getScriptProperties();
var BASE_URL    = (PROPS.getProperty('VERCEL_BASE_URL') || 'https://efterplan.se').replace(/\/$/, '');
var SECRET      = PROPS.getProperty('ADS_AGENT_SECRET') || '';

function main() {
  if (!SECRET) {
    Logger.log('FEL: ADS_AGENT_SECRET saknas i Script Properties. Lägg till den och kör igen.');
    return;
  }

  var now     = new Date();
  var dateStr = Utilities.formatDate(now, 'UTC', 'yyyy-MM-dd');
  var isMonday = now.getDay() === 1;

  Logger.log('=== Efterplan Ads Agent ' + dateStr + ' ===');

  runStep('Exporterar sökordsprestanda', function() { exportKeywords(dateStr); });
  if (isMonday) {
    runStep('Exporterar söktermer (måndag)', function() { exportSearchTerms(dateStr); });
  }
  runStep('Hämtar och implementerar beslut', function() { applyDecisions(); });

  Logger.log('=== Klar ===');
}

// ── Dataexport ──────────────────────────────────────────────

function exportKeywords(dateStr) {
  var keywords = [];
  var iter = AdsApp.keywords()
    .withCondition('CampaignStatus = ENABLED')
    .withDateRange('LAST_7_DAYS')
    .orderBy('Cost DESC')
    .get();

  while (iter.hasNext()) {
    var kw    = iter.next();
    var stats = kw.getStatsFor('LAST_7_DAYS');
    var cost  = stats.getCost();
    var clicks = stats.getClicks();
    keywords.push({
      snapshot_date:    dateStr,
      campaign_name:    kw.getCampaign().getName(),
      ad_group:         kw.getAdGroup().getName(),
      keyword:          kw.getText(),
      match_type:       kw.getMatchType(),
      impressions:      stats.getImpressions(),
      clicks:           clicks,
      cost_micros:      Math.round(cost * 1000000),
      conversions:      stats.getConversions(),
      conversion_value: stats.getConversionValue(),
      avg_cpc_micros:   clicks > 0 ? Math.round((cost / clicks) * 1000000) : 0,
      quality_score:    kw.getQualityScore() || null,
    });
  }

  if (keywords.length === 0) { Logger.log('Inga aktiva sökord.'); return; }

  var resp = apiPost('/api/ads-telemetry', { type: 'keywords', data: keywords, date: dateStr });
  Logger.log('Sökord: ' + keywords.length + ' rader → HTTP ' + resp.code);
}

function exportSearchTerms(dateStr) {
  var terms = [];
  try {
    var report = AdsApp.search(
      'SELECT search_term_view.search_term, ' +
      '  ad_group.name, ' +
      '  segments.keyword.info.text, ' +
      '  metrics.impressions, ' +
      '  metrics.clicks, ' +
      '  metrics.cost_micros, ' +
      '  metrics.conversions ' +
      'FROM search_term_view ' +
      'WHERE segments.date DURING LAST_30_DAYS ' +
      '  AND campaign.status = \'ENABLED\' ' +
      '  AND metrics.impressions > 0 ' +
      'ORDER BY metrics.cost_micros DESC ' +
      'LIMIT 300'
    );
    while (report.hasNext()) {
      var row = report.next();
      terms.push({
        snapshot_date:      dateStr,
        search_term:        row['search_term_view.search_term'],
        ad_group:           row['ad_group.name'],
        triggered_keyword:  row['segments.keyword.info.text'],
        impressions:        parseInt(row['metrics.impressions'])  || 0,
        clicks:             parseInt(row['metrics.clicks'])       || 0,
        cost_micros:        parseInt(row['metrics.cost_micros'])  || 0,
        conversions:        parseFloat(row['metrics.conversions']) || 0,
      });
    }
  } catch (e) {
    Logger.log('search() misslyckades (GAQL kanske inte stöds): ' + e.message);
    return;
  }

  if (terms.length === 0) { Logger.log('Inga söktermer hittades.'); return; }

  var resp = apiPost('/api/ads-telemetry', { type: 'search_terms', data: terms, date: dateStr });
  Logger.log('Söktermer: ' + terms.length + ' rader → HTTP ' + resp.code);
}

// ── Besluts-implementation ──────────────────────────────────

function applyDecisions() {
  var resp = apiGet('/api/ads-decisions');
  if (resp.code !== 200) { Logger.log('Kunde inte hämta beslut (HTTP ' + resp.code + ')'); return; }

  var decisions;
  try { decisions = JSON.parse(resp.body).decisions || []; }
  catch (e) { Logger.log('Parse-fel på beslutssvar: ' + e.message); return; }

  Logger.log(decisions.length + ' beslut att implementera.');

  var applied = [], skipped = [];
  for (var i = 0; i < decisions.length; i++) {
    var d  = decisions[i];
    var ok = implementDecision(d);
    (ok ? applied : skipped).push(d.id);
    Logger.log((ok ? '✓' : '✗') + ' ' + d.decision_type + ': ' + (d.entity_name || '') +
               (ok ? ' — ' + d.reasoning.substring(0, 60) + '…' : ' (hoppades över)'));
  }

  if (applied.length > 0 || skipped.length > 0) {
    apiPost('/api/ads-decisions', { applied: applied, skipped: skipped });
  }
}

function implementDecision(d) {
  var a = d.action || {};
  try {
    if (d.decision_type === 'pause_keyword')  return pauseKeyword(a.ad_group, a.keyword_text || d.entity_name);
    if (d.decision_type === 'enable_keyword') return enableKeyword(a.ad_group, a.keyword_text || d.entity_name);
    if (d.decision_type === 'add_negative')   return addNegative(a.campaign_name, a.keyword_text, a.match_type || 'BROAD');
    if (d.decision_type === 'add_keyword')    return addKeyword(a.ad_group_name || a.ad_group, a.keyword_text, a.match_type || 'PHRASE');
    Logger.log('Okänd beslutstyp: ' + d.decision_type);
    return false;
  } catch (e) {
    Logger.log('FEL i implementDecision(' + d.decision_type + '): ' + e.message);
    return false;
  }
}

function pauseKeyword(adGroup, kwText) {
  var clean = stripMatchChars(kwText);
  var iter  = AdsApp.keywords().withCondition("Text = '" + clean + "'").withCondition('CampaignStatus = ENABLED').get();
  var found = false;
  while (iter.hasNext()) {
    var kw = iter.next();
    if (!adGroup || kw.getAdGroup().getName() === adGroup) { kw.pause(); found = true; }
  }
  return found;
}

function enableKeyword(adGroup, kwText) {
  var clean = stripMatchChars(kwText);
  var iter  = AdsApp.keywords().withCondition("Text = '" + clean + "'").withCondition('Status = PAUSED').get();
  var found = false;
  while (iter.hasNext()) {
    var kw = iter.next();
    if (!adGroup || kw.getAdGroup().getName() === adGroup) { kw.enable(); found = true; }
  }
  return found;
}

function addNegative(campaignName, kwText, matchType) {
  if (!kwText) return false;
  var formatted = formatKeyword(kwText, matchType);
  var iter = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  while (iter.hasNext()) {
    var camp = iter.next();
    if (!campaignName || camp.getName() === campaignName) {
      camp.createNegativeKeyword(formatted);
      return true;
    }
  }
  return false;
}

function addKeyword(adGroupName, kwText, matchType) {
  if (!kwText || !adGroupName) return false;
  var formatted = formatKeyword(kwText, matchType);
  var iter = AdsApp.adGroups().withCondition("Name = '" + adGroupName + "'").withCondition('Status = ENABLED').get();
  if (iter.hasNext()) { iter.next().newKeywordBuilder().withText(formatted).build(); return true; }
  return false;
}

// ── Hjälpfunktioner ─────────────────────────────────────────

function stripMatchChars(text) {
  return (text || '').replace(/^\[|\]$|^"|"$/g, '').trim();
}

function formatKeyword(text, matchType) {
  var clean = stripMatchChars(text);
  if (matchType === 'EXACT')  return '[' + clean + ']';
  if (matchType === 'PHRASE') return '"' + clean + '"';
  return clean;
}

function apiPost(path, data) {
  return apiCall('POST', path, data);
}

function apiGet(path) {
  return apiCall('GET', path, null);
}

function apiCall(method, path, data) {
  var opts = {
    method: method.toLowerCase(),
    headers: { 'Content-Type': 'application/json', 'X-Ads-Agent-Secret': SECRET },
    muteHttpExceptions: true,
  };
  if (data) opts.payload = JSON.stringify(data);
  var resp = UrlFetchApp.fetch(BASE_URL + path, opts);
  return { code: resp.getResponseCode(), body: resp.getContentText() };
}

function runStep(label, fn) {
  Logger.log('→ ' + label + '…');
  try { fn(); } catch (e) { Logger.log('FEL i "' + label + '": ' + e.message); }
}
