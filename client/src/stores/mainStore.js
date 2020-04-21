//import FeathersRestClient from "../boot/feathersRestClientConfig";
//import FeathersSocketClient from "../boot/feathersSocketClientConfig";
import FeathersRestClient from "../boot/feathersSocketClientConfig"; //Fake (Socket --> Rest) damits trotzdem funktioniert

//Hier könnte der zweite FeathersClient eingebunden werden
//Dieser soll über Sockets die Events verarbeiten
//In der Shopping und Order Seite könnte ein Event Listener platziert werden
//Sobald die events eintreten, werden die Event Listener ausgeführt
//Diese aktualisieren die Daten der jeweilgen Seite (order, shopping)
//ABER vll kümmert sich vue automatisch um die aktualisierung wenn sich die Daten hier ändern?!
//ABER wenn vue sich darüm kümmert (also das reine aktualisieren der Daten-arrays hier im Store reicht)
//dann muss irgendwie das neu zeichnen der jeweiligen Seite getriggert werden

//Hier zu Socket ausbessern
FeathersRestClient.service("articles").on("patched", message => {
  MainStore.articles.load();
  console.log("Socket Listeneder: Patched", message);
});
// FeathersSocketClient.service("articles").on("created", message => {
//   console.log("article created", message);
// });
// FeathersSocketClient.service("articles").on("removed", message => {
//   console.log("article deleted", message);
//   MainStore.articles.load();
// });

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
  articles: {
    data: [],
    dataGrouped: [],
    async load() {
      console.log("Main Store: Load Data", navigator.onLine);

      if (navigator.onLine === false) {
        console.log("OFFLINE; return localData");
        this.data = JSON.parse(localStorage.getItem("articles"));
        return this.data;
      }

      await FeathersRestClient.authenticate(); //muss vorher ausgeführt werden damit der JWT-Auth-Token mitgesendet wird

      return (
        FeathersRestClient.service("articles")
          //.find({ query: { status: "open" } })
          .find({ query: {} })
          .then(result => {
            localStorage.setItem("articles", JSON.stringify(result.data));
            this.data = JSON.parse(localStorage.getItem("articles"));
            //this.data = result.data;
            console.log("Online; return online data");
            return this.data;
          })
          .catch(err => {
            console.log("Load error: ", err);
          })
      );
    },
    async add(newArticle) {
      return FeathersRestClient.service("articles")
        .create(newArticle)
        .then(async result => {
          await this.data.push(result);
          await this.getArticlesgroupedByName();
          return result;
        })
        .catch(err => {
          console.log("New Article - error: ", err);
        });
    },
    async delete(itemId) {
      return FeathersRestClient.service("articles")
        .remove(itemId)
        .then(async () => {
          this.data = await this.data.filter(obj => obj._id != itemId);
          await this.getArticlesgroupedByName();
          return this.data;
        })
        .catch(err => {
          console.log("Delete Article - error: ", err);
        });
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
    }
  },

  user: {
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
      const reAuth = await FeathersRestClient.authenticate();
      this.data = reAuth.user;
      return reAuth;
    },
    async login(loginData) {
      return FeathersRestClient.authenticate({
        strategy: "local",
        ...loginData
      })
        .then(result => {
          this.data = result.user;
          return result;
        })
        .catch(err => {
          this.data = {};
          throw err;
        });
    },
    async logout() {
      localStorage.clear();
      this.data = {};
      location.reload();
    }
  }
};

export default MainStore;
