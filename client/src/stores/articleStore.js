import FeathersSocketClient from "../boot/feathersSocketClientConfig";
//import FeathersQueue from "./FeathersQueue";
import User from "./userStore";
import DexieDB from "./dexieDB";
import Queue from "./queue";
import { v4 as uuid } from "uuid";

const articles = {
  construct() {
    //Wird bei Zuweisung zum Store aufgerufen

    //Register Articles to Queue
    Queue.listener.register(articles.update);

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
    console.log("ListenerLoadData");

    articles.load();
  },
  async load() {
    //Immer ReAuthenticate vor dem Laden ausführen damit beim Neu-Laden/Refresh der Benutzer bekannt ist
    await User.reAuthenticate();

    if (navigator.onLine === true) {
      console.log("Online --> Return Online Data");
      await this.loadOnlineData();
    } else {
      console.log("Online --> Return Offline Data");
    }

    await this.updateData();
  },
  async loadOnlineData() {
    // this.isLoading = true;
    await FeathersSocketClient.service("articles")
      .find({ query: {} })
      .then(result => {
        //Die aktuellen Daten aus der Datenbank löschen
        this.database.clear();

        console.log("Result", result.data);

        //Die Daten vom Server in die lokale Datenbank schreiben
        this.database.bulkAdd(result.data);

        console.log("Load Server-Data: Successful");
      })
      .catch(err => {
        console.log("Load Server-Data: Error", err);
      })
      .finally(() => {
        // this.isLoading = false;
      });
  },

  async updateData() {
    this.data = await this.database.orderBy("createdAt").toArray();
    this.dataGrouped = this.getArticlesgroupedByName();
  },

  async add(newArticle) {
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
      this.updateData();
    });
  },

  async delete(itemId) {
    if (this.deleteLock === true) return;
    console.log("Locked");
    this.deleteLock = true;
    setTimeout(() => {
      console.log("UndLocked");
      this.deleteLock = false;
    }, 500);

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
        this.updateData();
      });
  },

  async buy(item) {
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
  }
};

export default articles;
