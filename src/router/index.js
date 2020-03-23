import Vue from "vue";
import VueRouter from "vue-router";
import Today from "../views/Today.vue";
import AllEvents from "../views/AllEvents.vue";
import SubmitEvent from "../views/SubmitEvent.vue";

Vue.use(VueRouter);

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

export default router;
