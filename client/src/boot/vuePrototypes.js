import { boot } from "quasar/wrappers";
import FeathersClient from "./feathersClientConfig";
import MainStore from "../stores/mainStore";

// eslint-disable-next-line no-unused-vars
export default boot(async ({ app, router, store, Vue }) => {
  // something to do
  Vue.prototype.$feathers = FeathersClient;
  Vue.prototype.$mainStore = MainStore;
});
