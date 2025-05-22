importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDblWYZc_w3PixkSFY3JAX3U9jI5NAd5Kk",
  authDomain: "zapjot-8ea6d.firebaseapp.com",
  projectId: "zapjot-8ea6d",
  storageBucket: "zapjot-8ea6d.firebasestorage.app",
  messagingSenderId: "665739064935",
  appId: "1:665739064935:web:001a41473ebb4be92f86c2",
  measurementId: "G-EWLG7TQJ50",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const url = payload.fcmOptions?.link || payload.data?.url || "/";

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body || "New notification",
    icon: "/logo.webp",
    data: { url },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event);

  event.notification.close();

  // Handle notification click - navigate to URL if specified
  const urlToOpen = event.notification.data?.url;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (!urlToOpen) return;

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
