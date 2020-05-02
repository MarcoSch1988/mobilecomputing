import articles from "./articleStore";
import user from "./userStore";
import queue from "./queue";

const MainStore = {
  user: user.construct(),
  articles: articles.construct(),
  queue: queue.construct()
};

export default MainStore;
