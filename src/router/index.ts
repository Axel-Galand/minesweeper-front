import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "game",
    component: GameView,
  },
  {
    path: "/menu",
    name: "menu",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MenuView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
