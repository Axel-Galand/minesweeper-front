import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Networking from "./api";

createApp(App).use(store).use(router).mount("#app");
const networking = new Networking();
networking.init.then(() => {
  networking.play({ x: 0, y: 1 }, { x: 5, y: 1 }).then((e) => {
    console.log(e);
  });
});
