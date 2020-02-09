
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from "./pages/Home";

const routes = [{
    path: "/",
    component: Home
}]

export const router = new VueRouter({
    routes,
    mode: "history"
});
