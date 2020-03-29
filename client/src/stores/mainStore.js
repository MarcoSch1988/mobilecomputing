import FeathersClient from "../boot/feathersClientConfig";

FeathersClient.service("articles").on("patched", message => {
  console.log("article patched", message);
  MainStore.listener.executeAll();
});
FeathersClient.service("articles").on("created", message => {
  console.log("article created", message);
});
FeathersClient.service("articles").on("removed", message => {
  console.log("article deleted", message);
  MainStore.articles.load();
});

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
      console.log("Load Data");
      return (
        FeathersClient.service("articles")
          //.find({ query: { status: "open" } })
          .find({ query: {} })
          .then(result => {
            this.data = result.data;
            return result.data;
          })
      );
    },
    async add(newArticle) {
      return FeathersClient.service("articles")
        .create(newArticle)
        .then(async result => {
          await this.data.push(result);
          return result;
        })
        .catch(err => {
          console.log("New Article - error: ", err);
        });
    },
    async delete(itemId) {
      return FeathersClient.service("articles")
        .remove(itemId)
        .then(async () => {
          this.data = await this.data.filter(obj => obj._id != itemId);
          return this.data;
        })
        .catch(err => {
          console.log("Delete Article - error: ", err);
        });
    },
    async buy(item) {
      return FeathersClient.service("articles")
        .patch(item._id, { status: "closed" })
        .then(async result => {
          await this.load();
          await this.getArticlesgroupedByName();
          console.log("updated: ", result);
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

      return FeathersClient.api.user
        .create(data)
        .then(result => {
          return result;
        })
        .catch(err => {
          throw err;
        });
    },
    async reAuthenticate() {
      const reAuth = await FeathersClient.authenticate();
      this.data = reAuth.user;
      return reAuth;
    },
    async login(loginData) {
      return FeathersClient.authenticate({
        strategy: "local",
        ...loginData
      })
        .then(result => {
          this.data = result.user;
          console.log(this.data);
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
