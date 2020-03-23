import Vue from "vue";
import VueRouter from "vue-router";
import VueCookie from "vue-cookie";

import Today from "../views/Today.vue";
import AllEvents from "../views/AllEvents.vue";
import SubmitEvent from "../views/SubmitEvent.vue";

Vue.use(VueRouter);
Vue.use(VueCookie);

const routes = [
  {
    path: "/",
    name: "Today",
    component: Today
  },
  {
    path: "/all-events",
    name: "All events",
    component: AllEvents
  },
  {
    path: "/submit-event",
    name: "Submit event",
    component: SubmitEvent
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = Vue.cookie.get("x-access-token");

  if (token || to.fullPath === "/login") {
    next();
  } else {
    next("/login");
  }
});

export default router;
