import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import * as csrfHelper from "@/utils/csrfToken";
import { API_BASE_URL } from "@/config";

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
  {
    path: "/product/:id",
    name: "Product",
    component: () => import("../views/Product.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 路由守衛
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const body = await csrfHelper.setcsrfTokenAsRequestBody();
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      credentials: "include",
    });
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
