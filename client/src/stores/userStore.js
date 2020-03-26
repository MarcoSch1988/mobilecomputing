import FeathersClient from "../boot/feathersClientConfig";

const UserStore = {
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
    async login(loginData) {
      return FeathersClient.authenticate({
        strategy: "local",
        ...loginData
      })
        .then(user => {
          this.user = user;
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
