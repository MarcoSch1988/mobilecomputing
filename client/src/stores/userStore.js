import FeathersClient from "../boot/feathersClientConfig";

const UserStore = {
  user: {},
  data: {
    function() {
      return {
        user: {}
      };
    }
  },
  methods: {
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
      this.user = reAuth.user;
      return reAuth;
    },
    async login(loginData) {
      console.log(loginData);
      return FeathersClient.authenticate({
        strategy: "local",
        ...loginData
      })
        .then(user => {
          this.user = user;
          console.log("userDefinded", user);
          return user;
        })
        .catch(err => {
          this.user = {};
          throw err;
        });
    },
    async logout() {
      localStorage.clear();
      this.user = {};
      location.reload();
    }
  }
};

export default UserStore;
