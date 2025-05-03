import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
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
  {
    path: "/loginresult",
    name: "LoginResult",
    component: () => import("../views/LoginResult.vue"),
  },
  {
    path: "/membercenter",
    name: "MemberCenter",
    component: () => import("../views/MemberCenter.vue"),
    meta: { requiresAuth: true },
  },
  // 可根據需求新增其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 路由守衛
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const res = await fetch("http://localhost:3000/profile", {
      credentials: "include", // 💡 否則 cookie 不會帶過去
    });

    const data = await res.json();

    if (res.ok) {
      // 已登入，允許前往
      next();
    } else {
      // 未登入，導向登入頁
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
