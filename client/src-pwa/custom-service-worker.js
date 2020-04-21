/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
workbox.routing.registerNavigationRoute("/index.html");

workbox.precaching.precacheAndRoute(self.__precacheManifest);
