import { boot } from "quasar/wrappers";
import FeathersClient from "./feathersClientConfig";

export default boot(async ({ app, router, store, Vue }) => {
  // something to do
  Vue.prototype.$feathers = FeathersClient;
});
