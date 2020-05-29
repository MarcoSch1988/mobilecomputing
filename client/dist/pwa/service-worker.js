importScripts("/precache-manifest.a0a4a64fb1cd77d68927252cdf51db69.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
workbox.routing.registerNavigationRoute("/index.html");

workbox.precaching.precacheAndRoute(self.__precacheManifest);

