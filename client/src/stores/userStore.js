import FeathersSocketClient from "../boot/feathersSocketClientConfig";

const user = {
  construct() {
    return this;
  },
  data: {},
  async register(registrationData) {
    const data = {
      stragtegy: "local",
      ...registrationData
    };

    return FeathersSocketClient.api.user
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
      const reAuth = await FeathersSocketClient.authenticate();
      this.data = reAuth.user;
    } else {
      this.data = JSON.parse(localStorage.getItem("user"));
    }
  },
  async login(loginData) {
    return FeathersSocketClient.authenticate({
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

export default user;
