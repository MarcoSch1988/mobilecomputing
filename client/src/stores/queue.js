import FeathersSocketClient from "../boot/feathersSocketClientConfig";
import DexieDB from "./dexieDB";

const Queue = {
  construct() {
    window.addEventListener("online", async () => {
      this.optimiseThenExectue();
    });

    //Responses in laden
    this.loadResponses();

    return this;
  },

  listener: {
    listeners: [],
    register(func) {
      this.listeners.push(func);
    },
    unregister(func) {
      this.listeners = this.listeners.filter(listener => listener != func);
    },
    notify() {
      this.listeners.forEach(func => func());
    }
  },
  requestsDB: DexieDB.requests,
  responsesDB: DexieDB.responses,

  responses: [],

  add(object) {
    this.requestsDB.add(object).then(() => {
      this.optimiseThenExectue();
    });
  },
  async optimiseThenExectue() {
    await this.optimiseQueue();
    this.execute();
  },
  async optimiseQueue() {
    //Die Queue durchlaufen und schauen ob ein Delete nach einem Create für die gleiche ID vorkommt
    //Wurde ja sonst nur sinnlos am Server erstellt werden, um danach gleich wieder gelöscht zu werden
  },
  async execute() {
    //Die Queue mit dem Server synchonisieren

    //Auslesen der Datenbank und sofort löschen
    const AllRequests = await this.requestsDB.toArray();
    //Löschen der Einträge --> Eigentlich müsste man hier einen lock einführen.
    //wenn gerade Einträge dazukommen hat man sonst ein Problem
    this.requestsDB.clear();

    //TODO
    //Umstellen auf Durchlauf der Datenbank und löschen nach jedem einzelnen Element
    //Sonst hat man wie zuvor erwähnt Probleme wenn neue Einträge eintreffen

    await Promise.all(
      AllRequests.map(async entry => {
        switch (entry.type) {
          case "create":
            await FeathersSocketClient.service(entry.service)
              .create(entry.data)
              .then(() => {
                //Erfolgreich an den Server gesendet
                //console.log("Successfully synced: " + entry.type, result);
              })
              .catch(err => {
                this.addToResponseQueue(err);
              });
            break;
          case "remove":
            await FeathersSocketClient.service("articles")
              .remove(entry.data._id)
              .then(() => {
                //Erfolgreich an den Server gesendet
                //console.log("Successfully synced: " + entry.type, result);
              })
              .catch(err => {
                //Feather schickt immer einen Error wenn das Sync nicht funktioniert hat
                this.addToResponseQueue(err);
              });
            break;
          case "patch":
            break;
        }
      })
    ).then(async () => {
      //Die Subscriber über die Ausführung informieren
      const ReqArray = await this.requestsDB.toArray();

      if (ReqArray.length < 1) {
        //Falls in der Zwischenzeit neue Request hereingekommen sind, nicht benachrichtigen
        //Sonst führt schnelles löschen zu Problemen
        this.listener.notify();
      }
    });
  },

  loadResponses() {
    this.responsesDB.toArray().then(result => {
      this.responses = result; //Für Update im Frontend müssen die Responses wieder in den Array geladen werden.
    });
  },
  addToResponseQueue(error) {
    console.log("ResponseQueue: ", error);
    switch (error.errors.type) {
      case "already exists":
        this.responsesDB
          .add({
            text: "Der Artikel '" + error.errors.text + "' existiert bereits"
          })
          .then(async () => {
            this.responses = await this.responsesDB.toArray();
          });
        break;
      default:
        break;
    }
  },
  deleteResponse(id) {
    this.responsesDB
      .where("id")
      .equals(parseInt(id))
      .delete()
      .then(() => {
        this.loadResponses(); //Neu laden damit das Frontend aktualisiert wird
      })
      .catch(err =>
        console.log("Error during deletion of item in request queue: ", err)
      );
  }
};

export default Queue;
