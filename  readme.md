Defender Day Fair — Invitation Page

Documentation & deployment guide

This repository contains a single-page responsive invitation for a school-sponsored Defender Day charity fair (HTML + CSS + JavaScript + a minimal sw.js). The page matches the poster’s color scheme and provides:

Event details (date/time/location)

Add-to-calendar (.ics download + Google Calendar link)

A "Нагадати мені" (Remind me) button which attempts to schedule two web notifications:

1 day before the event

2 hours before the event
(With a graceful fallback to in-page timers when background scheduling is not supported.)

This README explains files, configuration, deployment to GitHub Pages, supported browsers, limitations, customization, and troubleshooting.

Repository contents
/
├─ index.html        # Main invitation page (Bootstrap + JS)
├─ sw.js             # Minimal service worker for notifications
├─ README.md         # This documentation
└─ assets/           # (optional) images / svg / icons


The index.html is a single-file responsive page. sw.js is a tiny Service Worker used for notification handling and for the Notification click behavior.

Quick start (deploy to GitHub Pages)

Create (or use) a GitHub repository and clone it locally:

git clone https://github.com/<your-user>/<repo>.git
cd <repo>


Copy the page files into the repo root (index.html, sw.js, optional assets/).

Commit and push:

git add index.html sw.js assets/
git commit -m "Add Defender Day invitation page"
git push origin main


Enable GitHub Pages:

Go to Settings → Pages in your repository

Choose branch main (or gh-pages) and folder / (root)

Save — GitHub will provide a HTTPS URL (e.g. https://<user>.github.io/<repo>/)

Open the page URL in a modern browser (Chrome/Edge recommended) and test the Нагадати мені button.

Files explained
index.html

Uses Bootstrap 5 via CDN for responsive layout and basic components.

Contains the UI, event constants (at top of the inline script), calendar link generation, and notification scheduling logic.

Editable constants are near the top of the <script>:

const EVENT_LOCAL_ISO = "2025-10-01T13:20:00"; // event start local ISO string
const EVENT_DURATION_MIN = 120;
const EVENT_TITLE = "Благодійний ярмарок ...";
const EVENT_LOCATION = "Зубрянський ліцей ...";
const EVENT_DESC = "...";


Update these to change date/time, title, description, and duration.

Generates:

Google Calendar link (pre-filled)

.ics file (programmatically created and downloadable)

Notification scheduling logic (uses Notification.requestPermission())

sw.js

Minimal service worker that:

Calls skipWaiting() and clients.claim() for quick activation.

Listens to notificationclick to focus or open the page when the notification is tapped.

Deploy it to the same directory as index.html (root) so scope and registration behave correctly.

How the reminder / notification mechanism works

Permission: clicking “Нагадати мені” prompts user to grant Notifications permission.

Service Worker registration: the page registers sw.js. A service worker is required for some notification scheduling features and to handle notification clicks.

Scheduling:

If the browser supports the Notification Triggers API (currently experimental — Chrome/Edge with flags or recent versions), the page attempts to register notifications that will fire at specific timestamps even when the page is closed.

If Notification Triggers are not available, the page sets in-page timers (setTimeout) to show notifications while the tab is open. A message explains this limitation and suggests adding the event to the calendar.

Fallbacks:

.ics file and Google Calendar links are provided for reliable reminders on any device.

The page also displays status messages explaining what will work in the current browser.

Browser support & limitations

Recommended: Chrome / Edge (Chromium) — best support for modern Notification features and Service Worker behavior.

Firefox: supports Service Workers and notifications but does not currently support Notification Triggers (background scheduled notifications). Timers fallback will work only while the page/tab is open.

Safari (macOS/iOS): historically restricted; Safari supports Notification API on macOS but iOS support is limited. Service Worker and scheduling behavior vary.

Important: background scheduled notifications (Notification Triggers) are experimental and available only on some Chromium builds. The page therefore includes fallbacks and calendar links.

Security & privacy

Page must be served over HTTPS for:

Notifications to work

Service Worker registration

GitHub Pages provides HTTPS by default — recommended.

The page does not store or transmit personal data to external servers. Notification scheduling is local to the user’s device/browser.

If you add analytics or external scripts, update this README and ensure privacy compliance.

Customization & theming

Colors: edit CSS variables in index.html (:root { --sky: ...; --blue: ...; --yellow: ... }).

Add poster assets: place images in assets/ and reference them in index.html. Keep image sizes optimized for web (JPEG/PNG/WebP, ~100–300 KB recommended).

Add your school logo to header: insert an <img> with class="img-fluid" inside the header container.

Localize: the page is Ukrainian by default; edit text content in the HTML to translate.

Using the .ics and Google Calendar links

.ics:

The page generates an .ics blob for the event using the visitor’s timezone and offers it for download.

This file can be opened/imported by Outlook, Apple Calendar, and most calendar apps.

Google Calendar:

The built link pre-fills event title, description, location, start/end times and opens Google Calendar’s event dialog.

Testing locally (development)

Service Worker registration requires HTTPS in browsers, but you can test locally via http://localhost which Chrome treats as secure.

Simple local server (Python 3):

# from repo root
python -m http.server 8000
# then open http://localhost:8000/index.html


Chrome flags and experimental APIs:

To test Notification Triggers you may need a recent Chromium build or enable experimental features; check browser docs. (No code changes needed — the page disables Trigger scheduling if the API is missing.)

Troubleshooting

SW registration fails

Ensure sw.js is in the same directory as index.html.

Check DevTools Console for errors. Common cause: sw.js not found (404).

Notifications not appearing

Check that you granted permission (browser address bar → notifications).

If Notification Triggers are unsupported, ensure the page remains open for the in-page timers fallback.

If using mobile, ensure the device/battery saver is not blocking background tasks.

.ics file not downloaded

Some browsers open .ics in a new tab. Use the browser's download or Save As to store.

Page not served over HTTPS

GitHub Pages serves HTTPS automatically. If using another hosting, enable TLS.

Deployment checklist

 Update event constants in index.html to match your final event date/time and text.

 Add your logo and poster images to assets/ (optional).

 Commit & push to GitHub.

 Enable GitHub Pages → use the branch that contains files.

 Open the page URL and test:

Calendar links work

.ics downloads

"Нагадати мені" prompts for permission and registers notifications (test via Chrome/Edge)

Advanced notes (for developers)

The page uses crypto.randomUUID() (modern browsers) for ICS UID. Replace if you need legacy support.

The simple Service Worker can be extended to handle push subscriptions (Push API) if you want server-driven push notifications — that requires a backend and VAPID keys.

Notification Triggers API usage in index.html checks for showTrigger or TimestampTrigger presence. This is intentionally conservative to avoid exceptions in unsupported browsers.