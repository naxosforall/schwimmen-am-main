/**
 * SCHWIMMEN AM MAIN — geschütztes Backend (Google Apps Script).
 *
 * Warum geschützt: Der Server (dieses Script, ausgeführt als Eigentümer) hält den
 * EINZIGEN Schreibzugriff auf das Google Sheet. Der Browser-Client kann nur DATEN
 * posten — er kann nichts löschen, nichts überschreiben und keine fremden Daten
 * auslesen. Damit ist kein Wipe/Vandalismus des Bestands möglich; das Schlimmste
 * ist Spam-Anhängen (im Sheet moderierbar). Zusätzlich: Honeypot + Lock (Flut-Schutz).
 *
 * Zwei append-only Register in EINEM Sheet:
 *   - 'signatures' : Petitions-Unterschriften (name, comment)
 *   - 'ideas'      : eingereichte eigene Gemeingut-Projekte (title, place, desc, name)
 * Der Client wählt per Feld  type:'idea'  das Ideen-Register; sonst Unterschrift.
 *
 * Deploy: siehe backend/README.md.
 */
const SIG = 'signatures';
const IDEAS = 'ideas';

function doGet() {
  return json({
    count: countRows(SIG),
    signatures: readSigs(),
    ideas: readIdeas()
  });
}

function doPost(e) {
  try {
    let p = {};
    try { p = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (_) {}
    if (p.hp) return json({ ok: false });                 // Honeypot: Bot -> still verwerfen
    const lock = LockService.getScriptLock();             // Flut-Sperre
    if (!lock.tryLock(4000)) return json({ ok: false, error: 'busy' });
    try {
      if (p.type === 'idea') {
        const title = clip(p.title, 80);
        if (!title) return json({ ok: false, error: 'empty' });
        ideaSheet().appendRow([nowIso(), title, clip(p.place, 60), clip(p.desc, 500),
          clip(p.name, 80) || 'anonym', today()]);
      } else {
        sigSheet().appendRow([nowIso(), clip(p.name, 60) || 'anonym', clip(p.comment, 400), today()]);
      }
    } finally { lock.releaseLock(); }
    return json({ ok: true });
  } catch (err) { return json({ ok: false, error: String(err) }); }
}

function readSigs() {
  const rows = sigSheet().getDataRange().getValues(); const out = [];
  for (let i = 1; i < rows.length; i++) out.push({ name: rows[i][1], comment: rows[i][2], date: rows[i][3] });
  return out.slice(-500);
}
function readIdeas() {
  const rows = ideaSheet().getDataRange().getValues(); const out = [];
  for (let i = 1; i < rows.length; i++) out.push({ title: rows[i][1], place: rows[i][2], desc: rows[i][3], name: rows[i][4], date: rows[i][5] });
  return out.slice(-500);
}
function countRows(name) { return Math.max(0, sheet(name, null).getLastRow() - 1); }

function clip(s, n) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]+/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
}
function nowIso() { return new Date().toISOString(); }
function today() { return Utilities.formatDate(new Date(), 'Europe/Berlin', 'dd.MM.yyyy'); }

function sigSheet() { return sheet(SIG, ['ts', 'name', 'comment', 'date']); }
function ideaSheet() { return sheet(IDEAS, ['ts', 'title', 'place', 'desc', 'name', 'date']); }
function sheet(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); if (header) sh.appendRow(header); }
  return sh;
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
