importScripts("/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", (event) => {
    self.skipWaiting(); // Forces the browser to activate the worker immediately
});

self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim()); // Takes control of the page immediately
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            try {
                // Load config dynamically
                await scramjet.loadConfig();
                
                // If the URL has our /service/ prefix, let Scramjet proxy it!
                if (scramjet.route(event)) {
                    return await scramjet.fetch(event);
                }
            } catch (err) {
                console.error("Scramjet Intercept Error:", err);
            }
            
            // Otherwise, let the browser handle it normally
            return fetch(event.request);
        })()
    );
});
