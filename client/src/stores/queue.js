import FeathersSocketClient from "../boot/feathersSocketClientConfig";
import DexieDB from "./dexieDB";

const Queue = {
  construct() {
    window.addEventListener("online", () => {
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
  isWorking: false,
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
    this.isWorking = true;

    //Für Demozecke, damit Queue nur ausgeführt wird wenn online
    if (navigator.onLine === false) return;
    console.log("Queue executed");

    //Auslesen der Datenbank und sofort löschen
    const AllRequests = await this.requestsDB.toArray();
    //Löschen der Einträge --> Eigentlich müsste man hier einen lock einführen.
    //wenn gerade Einträge dazukommen hat man sonst ein Problem
    this.requestsDB.clear();

    //TODO
    //Umstellen auf Durchlauf der Datenbank und löschen nach jedem einzelnen Element
    //Sonst hat man wie zuvor erwähnt Probleme wenn neue Einträge eintreffen

    //TODO
    //Funktion mitten in Funktion --> Verschönern
    //ABER VORSICHT: Die komische Konstellation war notwendig für den synchronen Ablauf (Eins nach dem Anderen)
    async function start(that) {
      for (const entry of AllRequests) {
        if (entry.type === "create") {
          await FeathersSocketClient.service(entry.service)
            .create(entry.data)
            .catch(async err => {
              //Feather schickt immer einen Error wenn das Sync nicht funktioniert hat
              await that.addToResponseQueue(err);
            });
        } else if (entry.type == "remove") {
          await FeathersSocketClient.service("articles")
            .remove(entry.data._id)
            .catch(async err => {
              //Feather schickt immer einen Error wenn das Sync nicht funktioniert hat
              await that.addToResponseQueue(err);
            });
        }
      }
    }

    await start(this);
    this.isWorking = false;
    this.listener.notify();
  },
  loadResponses() {
    this.responsesDB.toArray().then(result => {
      this.responses = result; //Für Update im Frontend müssen die Responses wieder in den Array geladen werden.
    });
  },
  addToResponseQueue(error) {
    //console.log("ResponseQueue: ", error);
    switch (error.name) {
      case "Conflict":
        //Alredy exists error
        if (error.errors.type == "already exists") {
          this.responsesDB
            .add({
              text: "Der Artikel '" + error.errors.text + "' existiert bereits"
            })
            .then(async () => {
              this.responses = await this.responsesDB.toArray();
            });
        }
        //Alredy patched error
        if (error.errors.type == "already patched") {
          this.responsesDB
            .add({
              text:
                "Der Artikel '" +
                error.errors.text +
                "' wurde bereits gekauft und konnte deshalb nicht gelöscht werden"
            })
            .then(async () => {
              this.responses = await this.responsesDB.toArray();
            });
        }

        break;
      case "NotFound":
        //Artikel der Lokal gelöscht wurde, wurde in der Zwischenzeit schon online gelöscht
        //Kein Benachrichtigung notwendig
        console.log(
          "Der Artikel mit der id=" + error.hook.id + " wurde bereits gelöscht"
        );
        break;
      default:
        console.log("Default:", error.errors.type);
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
