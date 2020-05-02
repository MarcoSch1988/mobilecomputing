import Dexie from "dexie";

//In eigenes File ausgelagert damit hier auch Versionsänderungen eingepflegt werden können.
//https://dexie.org/docs/API-Reference

const dexieDb = new Dexie("DB_ichgeheinkaufen");
dexieDb.version(1).stores({
  articles: "_id, sync, createdAt, [status+ordererId+text]",
  requests: "++id, _id, type, service",
  responses: "++id"
});

export default dexieDb;

//Beispiel für Versionsänderung der Datenbank

// db.version(1).stores({
//     friends: "++id,name,age,*tags",
//     gameSessions: "id,score"
// });

// db.version(2).stores({
//     friends: "++id, [firstName+lastName], yearOfBirth, *tags", // Change indexes
//     gameSessions: null // Delete table

// }).upgrade(tx => {
//     // Will only be executed if a version below 2 was installed.
//     return tx.table("friends").modify(friend => {
//         friend.firstName = friend.name.split(' ')[0];
//         friend.lastName = friend.name.split(' ')[1];
//         friend.birthDate = new Date(new Date().getFullYear() - friend.age, 0);
//         delete friend.name;
//         delete friend.age;
//     });
// });
