import { boot } from "quasar/wrappers";
import FeathersClient from "./feathersClientConfig";
import UserStore from "../stores/userStore";

export default boot(async ({ app, router, store, Vue }) => {
  // something to do
  Vue.prototype.$feathers = FeathersClient;
  Vue.prototype.$userStore = UserStore;
});
