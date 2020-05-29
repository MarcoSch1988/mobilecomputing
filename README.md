# mobilecomputing

EINFACHE INSTALLATION und START

0. Node.js muss am Computer installiert sein
1. Komplettes Verzeichnis herunterladen
2. install.bat ausführen und warten bis erfolgreich beendet
3. start.bat ausühren
4. http:/localhost:4000 im Browser öffnen

MANUELLE INSTALLATION und START

1. Komplettes Verzeichnis herunterladen
   2a. In Server Verzeichnis wechseln
   2b. Node Packages installieren mit "npm install"
   2c. Server starten mit "npm run start"
   3a. in Client Verzeichnis wechseln
   3b. Node Packages installieren mit "npm install"
   3c. Server starten mit "npm run start"

Die oben genannte Vorgehensweise ermöglicht die volle Offline-Funktionalität
durch einen Service-Worker. Es wird dabei Clientseitig auf fertig gebuildete
Dateien zurück. Das heißt, wenn Änderungen am Client-Code durchgeführt werden,
muss "quasar build -m pwa" ausgeführt werden, damit die Distrubition-Dateien
neu erstellt werden.
Das alles ist notwendig, das mit dem normalen Development-Server, aufgrund
von ungültigen SSL-Zertifkaten, kein Service-Worker registriert werden kann.

Verwendete Frameworks und Libraries

Server:
node.js: https://nodejs.org/en/
feathersjs: https://feathersjs.com
mongoose: https://mongoosejs.com/
mongodb: https://www.mongodb.com/de

Client:
quasar: https://quasar.dev
vue: https://vuejs.org/
dexie.js: https://dexie.org/
leaflet: https://leafletjs.com/
