// Minimal service worker for notifications on GitHub Pages
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// When a user clicks a notification, open the invite page
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        (async () => {
            const allClients = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
            if (allClients.length > 0) {
                allClients[0].focus();
            } else {
                await clients.openWindow('./');
            }
        })()
    );
});
