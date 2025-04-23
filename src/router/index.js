import { createRouter, createWebHistory } from "vue-router";
const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue"),
    },
    // 可根據需求新增其他路由
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
