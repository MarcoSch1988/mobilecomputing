import FeathersSocketClient from "../boot/feathersSocketClientConfig";
//import FeathersQueue from "./FeathersQueue";
import User from "./userStore";
import DexieDB from "./dexieDB";
import Queue from "./queue";
import { v4 as uuid } from "uuid";
import { date } from "quasar";

const articles = {
  construct() {
    //Wird bei Zuweisung zum Store aufgerufen

    //Register Articles to Queue
    Queue.listener.register(articles.update);

    this.registerEventListeners();

    //Muss immer sich selbst als Antwort liefern, weil das im MainStore verwendet wird
    return this;
  },
  data: [],
  dataGrouped: [],
  FeahtersServiceName: "articles",
  database: DexieDB.articles,
  isLoading: false,
  deleteLock: false,
  update: () => {
    //Event Listener der aufgerufen wird wenn Änderungen in der Queue erfolgt sind
    articles.load();
  },
  registerEventListeners() {
    //Event Listener
    FeathersSocketClient.service("articles").on("patched", () => {
      this.load();
    });

    //Event Listener
    FeathersSocketClient.service("articles").on("created", () => {
      this.load();
    });

    //Event Listener
    FeathersSocketClient.service("articles").on("removed", () => {
      this.load();
    });
  },
  async load() {
    //Einfaches Locking um während dem Laden keine Add, Delete, usw. zuzulassen
    if (this.isLoading === true) return;
    this.isLoading = true;

    //Immer ReAuthenticate vor dem Laden ausführen damit beim Neu-Laden/Refresh der Benutzer bekannt ist
    await User.reAuthenticate();

    if (navigator.onLine === true) {
      console.log("Online --> Return Online Data");
      await this.loadOnlineData();
    } else {
      console.log("Online --> Return Offline Data");
    }

    await this.updateData().finally(() => {
      //Locking wieder aufheben
      this.isLoading = false;
    });
  },
  async loadOnlineData() {
    //Prüfen ob die Queue arbeitet
    //Wenn die Queue noch arbeitet macht das abholen keinen Sinn und verursacht unnötiges Laden
    if (Queue.isWorking == true) return;

    await FeathersSocketClient.service("articles")
      .find({ query: {} })
      .then(result => {
        //Die aktuellen Daten aus der Datenbank löschen
        this.database.clear();

        //Die Daten vom Server in die lokale Datenbank schreiben
        this.database.bulkAdd(result.data);
      })
      .catch(err => {
        console.log("Load Server-Data: Error", err);
      })
      .finally(() => {
        //this.isLoading = false;
      });
  },

  async updateData() {
    this.data = await this.database.orderBy("createdAt").toArray();
    this.dataGrouped = this.getArticlesgroupedByName();
  },

  async add(newArticle) {
    //Einfacher Locking-Mechanismus
    //Bei Add ist locking nicht sinnvoll
    this.isLoading = true;

    //Prüfen ob der Artikel schon vorhanden ist
    const foundArticles = await this.database
      .where({ status: "open", ordererId: User.data._id, text: newArticle })
      .toArray();
    if (foundArticles.length > 0) {
      //Es existiert bereits ein solcher Eintrag
      throw "Der Artikel '" + newArticle + "' ist bereits vorhanden";
    }

    //Lokalen Artikel mit lokaler ID erstellen
    const localArticle = {
      _id: uuid(),
      text: newArticle,
      status: "open",
      orderer: User.data,
      ordererId: User.data._id,
      createdAt: new Date(Date.now()).toISOString(),
      synced: false,
      syncType: "create"
    };

    //Zur lokalen Datenbank hinzufügen
    this.database.add(localArticle).then(() => {
      Queue.add({
        type: "create",
        service: this.FeahtersServiceName,
        data: { _id: localArticle._id, text: newArticle } //Mehr Info braucht das Backend nicht, der Rest wird vom Backend erstellt (auch OrdererId zwecks Sicherheit)
      });
      this.updateData().then(() => {
        this.isLoading = false;
      });
    });
  },

  async delete(itemId) {
    //Einfacher Locking-Mechanismus -> Sonst kommt es beim schnellen Löschen zu Problemen
    if (this.isLoading === true) return;
    this.isLoading = true;

    //Alternative zum Locking wäre ein kurzes Timeout um zu schnelles Löschen zu verhindern

    //Artikel suchen
    const foundArticle = await this.database.get({ _id: itemId });
    if (!foundArticle) {
      throw "Artikel wurde nicht gefunden";
    }

    //In lokaler Datenbank löschen
    this.database
      .where({ _id: itemId })
      .delete()
      .then(() => {
        //An Queue schicken
        Queue.add({
          type: "remove",
          service: this.FeahtersServiceName,
          data: { _id: itemId }
        });

        //Daten aktualisieren -> Aktualisiert FrontEnd mit
        this.updateData().then(() => {
          this.isLoading = false;
        });
      });
  },

  async buy(item) {
    if (navigator.onLine == false) return false;

    return FeathersSocketClient.service("articles")
      .patch(item._id, { status: "closed" })
      .then(async () => {
        await this.load();
        await this.getArticlesgroupedByName();
      })
      .catch(err => {
        console.log("updated-error: ", err);
      });
  },

  async reactivate(item) {
    if (navigator.onLine == false) return false;

    return FeathersSocketClient.service("articles")
      .patch(item._id, { status: "open" })
      .then(async () => {
        await this.load();
        await this.getArticlesgroupedByName();
      })
      .catch(err => {
        console.log("updated-error: ", err);
      });
  },

  getArticlesgroupedByName() {
    let arraymap = {};
    this.data.forEach(x => {
      if (arraymap[x.ordererId] == undefined) {
        //Noch nicht enthalten
        arraymap[x.ordererId] = {
          id: x.ordererId,
          name: x.orderer.firstname + " " + x.orderer.surname,
          address: {
            latitude: x.orderer.latitude,
            longitude: x.orderer.longitude,
            distance: x.orderer.distance,
            plz: x.orderer.plz,
            city: x.orderer.city,
            street: x.orderer.street
          },
          isSelected: true,
          count: 0,
          items: []
        };
      }
      //Daten einfügen
      arraymap[x.ordererId].count++;
      arraymap[x.ordererId].items.push(x);
    });

    let returnArray = [];
    Object.keys(arraymap).forEach(key => {
      returnArray.push(arraymap[key]);
    });

    this.dataGrouped = returnArray;
    return returnArray;
  },
  setArticlesWithoutOld() {
    const maxAgeInHours = 24;

    //Article kopieren
    let myarticles = Array.from(this.articles.dataGrouped);

    let asd = myarticles.filter(article => {
      if (article.isSelected === false) {
        return;
      }
      article.items = article.items.filter(item => {
        //Prüfen ob Status = closed und boughtAt-Date älter als maxAgeinHours
        //Nur die Zurücklieferen die nicht zu alt sind

        let dateDiffInHours = date.getDateDiff(
          Date.now(),
          item.boughtAt,
          "hours"
        );
        if (
          (item.status === "closed" && dateDiffInHours <= maxAgeInHours) ||
          item.status === "open"
        ) {
          return item;
        }
      });
      return article;
    });

    this.dataGroupedWithoutOld = asd;
  }
};

export default articles;
