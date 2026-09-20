# SCHWIMMEN AM MAIN ✊

Eine parteiunabhängige Bürgerinitiative neuer und alter Frankfurter·innen. Wir erinnern die Stadt daran, dass der Main einmal ein Freibad war — und fordern, ihn wieder schwimmfähig zu machen.

**Live:** https://naxosforall.github.io/schwimmen-am-main/

## Die Aktion
Nach Einbruch der Dunkelheit projizieren wir historische Fotos der Frankfurter Flussbäder an die **Seitenwand Wasserweg 8–10**, bespielt vom **Parkplatz Wasserweg 12–14** — um die Ecke vom Deutschherrnufer, der östlichen Fortsetzung des Museumsufers. Im Loop läuft ein **riesiger QR-Code**, der hierher führt: unterschreiben & kommentieren.

## Die sechs Abschnitte der Seite
1. Die Vision
2. Der Beamer & die Aktion
3. Die Lage (warum der Main dreckig ist / was passieren muss)
4. Das Foto-Archiv, das wir beamen
5. Rendering der gebeamten Wand
6. Mitmachen — die Petition hinter dem QR

## QR-Code
`assets/qr.svg` / `assets/qr.png` (ECC H, auch projiziert scanbar), `assets/qr_white.svg` (invertiert für dunkle Wand). Ziel-URL: die Live-Seite oben. Neu erzeugen: `python3 -c "import segno;segno.make('<URL>',error='h').save('assets/qr.svg',scale=12,border=4)"`.

## Petition / Registry — Status
Aktuell **Prototyp**: Unterschriften & Kommentare werden per `localStorage` **lokal auf dem Gerät** gespeichert — gut zum Testen der Bedienung, aber noch nicht geteilt. Für die echte, geteilte, anonyme Sammlung fehlt nur ein kleines Backend. Optionen (kein Login für die Unterzeichnenden):
- **Formspree** (formspree.io) — Formular-Endpoint eintragen.
- **Google Apps Script Web App** — anonymer POST in ein Google Sheet.
- **Cloudflare Worker + KV** — schlank, kostenlos.
- **giscus** (GitHub-Discussions) — für die Freundes-Testphase, Kommentare geteilt (GitHub-Login nötig).

Sobald ein Endpoint steht, ersetzt er die `sign()`-Funktion in `index.html`.

## Archivbilder
Abschnitt 4 zeigt stilisierte Platzhalter. Echte Archivscans (z. B. Institut für Stadtgeschichte Frankfurt) rechtebereinigt einsetzen.

## Quellen (Inhalt)
Wikipedia „Liste der Schwimmbäder in Frankfurt am Main“ · Journal Frankfurt „Als Frankfurt planschen lernte“ · Stadtentwässerung Frankfurt (Kanalnetz/Mischwasser) · Stadt Frankfurt „Baden & Schwimmen in Main und Nidda“ · Merkurist „Schwimmen im Main bleibt ein Traum“.

#schwimmenammain
