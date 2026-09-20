/**
 * SCHWIMMEN AM MAIN — geschütztes Petitions-Backend (Google Apps Script).
 *
 * Warum geschützt: Der Server (dieses Script, ausgeführt als Eigentümer) hält den
 * EINZIGEN Schreibzugriff auf das Google Sheet. Der Browser-Client kann nur DATEN
 * posten — er kann nichts löschen, nichts überschreiben und keine fremden Daten
 * auslesen. Damit ist kein Wipe/Vandalismus des Bestands möglich; das Schlimmste
 * ist Spam-Anhängen (im Sheet moderierbar). Zusätzlich: Honeypot + Lock (Flut-Schutz).
 *
 * Deploy: siehe backend/README.md.
 */
const SHEET = 'signatures';

function doGet() {
  const rows = sheet().getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) out.push({ name: rows[i][1], comment: rows[i][2], date: rows[i][3] });
  return json({ count: out.length, signatures: out.slice(-500) });
}

function doPost(e) {
  try {
    let p = {};
    try { p = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (_) {}
    if (p.hp) return json({ ok: false });               // Honeypot: Bot -> still verwerfen
    const name = clip(p.name, 60) || 'anonym';
    const comment = clip(p.comment, 400);
    const lock = LockService.getScriptLock();            // Flut-Sperre
    if (!lock.tryLock(4000)) return json({ ok: false, error: 'busy' });
    try {
      sheet().appendRow([new Date().toISOString(), name, comment,
        Utilities.formatDate(new Date(), 'Europe/Berlin', 'dd.MM.yyyy')]);
    } finally { lock.releaseLock(); }
    return json({ ok: true });
  } catch (err) { return json({ ok: false, error: String(err) }); }
}

function clip(s, n) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]+/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
}
function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(['ts', 'name', 'comment', 'date']); }
  return sh;
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
