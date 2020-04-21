import { boot } from "quasar/wrappers";
import FeathersRestClient from "./feathersRestClientConfig";
import FeathersSocketClient from "./feathersSocketClientConfig";
import MainStore from "../stores/mainStore";

// eslint-disable-next-line no-unused-vars
export default boot(async ({ app, router, store, Vue }) => {
  // something to do
  Vue.prototype.$feathersRest = FeathersRestClient;
  Vue.prototype.$feathersSocket = FeathersSocketClient;
  Vue.prototype.$mainStore = MainStore;
});
