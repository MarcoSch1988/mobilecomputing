import FeathersSocketClient from "../boot/feathersSocketClientConfig";
import Dexie from "dexie";

export default class FeathersQueue {
  constructor(servicename) {
    this.service = servicename;

    this.db = new Dexie("DB_" + servicename);

    this.db.version(1).stores({
      requests: "++id, type",
      responses: "++id"
    });

    window.addEventListener("online", () => {
      //Anwendung ist wieder online -> Queue abarbeiten -> checkThenExcecute ausführen
      console.log("Request-Queue: Online again");
      this.checkThenExecute();
    });
    // window.addEventListener("offline", () => {
    //   this.online = navigator.onLine;
    //   this.dialogOffline = true;
    // });
  }

  async create(object) {
    this.db.requests.add({ type: "create", data: object }).then(() => {
      this.checkThenExecute();
    });
  }
  remove(objectId) {
    this.db.requests.add({ type: "remove", deleteId: objectId }).then(() => {
      this.checkThenExecute();
    });
  }
  checkThenExecute() {
    if (navigator.onLine === true) {
      this.execute();
    }
  }
  execute() {
    //Alle Einträge der Queue durchlaufen und an das Feathers Backend schicken
    //Die Responses werden in der Response Queue gespeichert.
    this.db.requests
      .toArray()
      .then(result => console.log("Whole Queue-Before: ", result));

    this.db.requests
      .toArray(requests =>
        requests.map(async request => {
          switch (request.type) {
            case "create":
              await FeathersSocketClient.service(this.service)
                .create(request.data)
                .then(async result => {
                  //Erfolgreich an den Server gesendet
                  console.log(result);
                })
                .catch(err => {
                  this.addToResponseQueue(err);
                })
                .finally(async () => {
                  await this.deleteFromQueue(request.id);
                });
              break;

            case "remove":
              await FeathersSocketClient.service("articles")
                .remove(request.deleteId)
                .then(async result => {
                  //Erfolgreich an den Server gesendet
                  console.log(result);
                })
                .catch(err => {
                  //Feather schickt immer einen Error wenn das Sync nicht funktioniert hat
                  this.addToResponseQueue(err);
                })
                .finally(async () => {
                  await this.deleteFromQueue(request.id);
                });

              break;
            case "patch":
              break;
          }
        })
      )
      .catch(err => {
        console.log("Dexie: ", err);
      });

    this.db.requests
      .toArray()
      .then(result => console.log("Whole Queue-After: ", result));
  }

  async deleteFromQueue(id) {
    //Delete from Queue in eigene Funktion auslagern function deleteFromQueue(id)
    await this.db.requests
      .where("id")
      .equals(parseInt(id))
      .delete()
      .catch(err =>
        console.log("Error during deletion of item in request queue: ", err)
      );
  }
  addToResponseQueue(error) {
    console.log("ResponseQueue: ", error);
    switch (error.errors.type) {
      case "already exists":
        this.db.responses.add({
          text: "Der Artikel '" + error.errors.text + "' existiert bereits"
        });
        break;
      default:
        break;
    }
  }

  getSyncProblems() {
    return this.db.responses.toArray();
  }

  deleteSyncProblem(id) {
    this.db.responses
      .where("id")
      .equals(parseInt(id))
      .delete()
      .catch(err =>
        console.log("Error during deletion of item in request queue: ", err)
      );
  }
}
