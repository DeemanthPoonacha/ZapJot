// Service Worker for handling push notifications
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  return self.clients.claim();
});

self.addEventListener("push", (event) => {
  console.log("Push notification received", event);

  if (!event.data) {
    console.log("No payload in push event");
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.body || "New notification",
      icon: data.icon || "/icon-192x192.png",
      badge: "/badge-72x72.png",
      data: {
        url: data.url || "/",
      },
      actions: data.actions || [],
      vibrate: [100, 50, 100],
      timestamp: Date.now(),
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Notification", options)
    );
  } catch (error) {
    console.error("Error showing notification:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event);

  event.notification.close();

  // Handle notification click - navigate to URL if specified
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If no window/tab is open with the URL, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
