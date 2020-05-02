//import FeathersRestClient from "../boot/feathersRestClientConfig";
//import FeathersSocketClient from "../boot/feathersSocketClientConfig";
import FeathersRestClient from "../boot/feathersSocketClientConfig"; //Fake (Socket --> Rest) damits trotzdem funktioniert
import FeathersQueue from "./FeathersQueue";
//Hier könnte der zweite FeathersClient eingebunden werden
//Dieser soll über Sockets die Events verarbeiten
//In der Shopping und Order Seite könnte ein Event Listener platziert werden
//Sobald die events eintreten, werden die Event Listener ausgeführt
//Diese aktualisieren die Daten der jeweilgen Seite (order, shopping)
//ABER vll kümmert sich vue automatisch um die aktualisierung wenn sich die Daten hier ändern?!
//ABER wenn vue sich darüm kümmert (also das reine aktualisieren der Daten-arrays hier im Store reicht)
//dann muss irgendwie das neu zeichnen der jeweiligen Seite getriggert werden

// //Hier zu Socket ausbessern
// FeathersRestClient.service("articles").on("patched", message => {
//   console.log("Socket Listeneder: Created", message);
//   MainStore.articles.load().then(() => {
//     MainStore.articles.getArticlesgroupedByName();
//   });

//   console.log("Socket Listeneder: Patched", message);
// });
// FeathersRestClient.service("articles").on("created", message => {
//   console.log("Socket Listeneder: Created", message);
//   MainStore.articles.load().then(() => {
//     MainStore.articles.getArticlesgroupedByName();
//   });
// });
// FeathersRestClient.service("articles").on("removed", message => {
//   console.log("Socket Listeneder: Created", message);
//   MainStore.articles.load().then(() => {
//     MainStore.articles.getArticlesgroupedByName();
//   });
// });

const user = {
  data: {},
  async register(registrationData) {
    const data = {
      stragtegy: "local",
      ...registrationData
    };

    return FeathersRestClient.api.user
      .create(data)
      .then(result => {
        return result;
      })
      .catch(err => {
        throw err;
      });
  },
  async reAuthenticate() {
    if (navigator.onLine === true) {
      const reAuth = await FeathersRestClient.authenticate();
      this.data = reAuth.user;
    } else {
      this.data = JSON.parse(localStorage.getItem("user"));
    }
  },
  async login(loginData) {
    return FeathersRestClient.authenticate({
      strategy: "local",
      ...loginData
    })
      .then(result => {
        this.data = result.user;
        localStorage.setItem("user", JSON.stringify(result.user));
        return result;
      })
      .catch(err => {
        this.data = {};
        throw err;
      });
  },
  async logout() {
    localStorage.clear();
    indexedDB.deleteDatabase("DB_articles");
    this.data = {};
    location.reload();
  }
};

const articles = {
  data: [],
  dataGrouped: [],
  queue: new FeathersQueue("articles"),
  async load() {
    //Immer ReAuthenticate vor dem Laden ausführen damit beim Neu-Laden/Refresh der Benutzer bekannt ist
    await user.reAuthenticate();

    if (navigator.onLine === false) {
      console.log("OFFLINE; return local Data");
      this.data = JSON.parse(localStorage.getItem("articles"));
      return this.data;
    }

    return FeathersRestClient.service("articles")
      .find({ query: {} })
      .then(result => {
        //Die Daten für die Persistenz in den LocalStorage schreiben
        localStorage.setItem("articles", JSON.stringify(result.data));

        //Die Daten zur Verwendung in der Anwendung in ein Objekt schreiben
        this.data = result.data;

        console.log("Online; return online data");
        return result.data;
      })
      .catch(err => {
        console.log("Load error: ", err);
      });
  },
  async add(newArticle) {
    this.queue.create(newArticle); //Ans Backend schicken

    //TODO
    //Nur dann hinzufügen wenn noch nicht in offenen vorhanden (Backend checkt das ja auch)
    //Logik for Frontend implementieren
    this.data.push({
      _id: "local-" + this.data.length,
      text: newArticle.text,
      status: "open",
      orderer: user.data,
      ordererId: user.data._id,
      onlyLocal: true
    });
    localStorage.setItem("articles", JSON.stringify(this.data));
  },
  async delete(itemId) {
    //Items mit der Eigenschaft onlyLocal sind noch nicht synchronisiert
    //Sie dürfen beim löschen also nicht an den Server geschickt werden
    if (itemId.toString().startsWith("local-") === false) {
      this.queue.remove(itemId); //Ans Backend schicken
    }

    this.data = await this.data.filter(obj => obj._id != itemId);
    localStorage.setItem("articles", JSON.stringify(this.data));
    return this.data;
  },
  async buy(item) {
    return FeathersRestClient.service("articles")
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
    return FeathersRestClient.service("articles")
      .patch(item._id, { status: "open" })
      .then(async () => {
        await this.load();
        await this.getArticlesgroupedByName();
      })
      .catch(err => {
        console.log("updated-error: ", err);
      });
  },
  async getArticlesgroupedByName() {
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
  async getSyncProblems() {
    return this.queue.getSyncProblems();
  },
  deleteSyncProblem(id) {
    this.queue.deleteSyncProblem(id);
  }
};

const MainStore = {
  listener: {
    data: [],
    add(func) {
      this.data.push(func);
    },
    executeAll() {
      this.data.forEach(x => x());
    }
  },

  user: user,
  articles: articles
};

export default MainStore;
