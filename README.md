# Shopping Web

## 簡介

Shopping Web 是一個基於 Vue 3 的前端購物網站，採用 **Vite** 進行開發，並整合 **Tailwind CSS** 作為 UI 樣式框架。此專案目前處於初期階段，已實作 **Google 第三方登入** 及基本頁面。

## 項目架構

### 前端技術

- **Vue 3** - 主框架
- **Vite** - 開發與建置工具
- **Tailwind CSS** - 樣式框架
- **Pinia** - 狀態管理
- **Vue Router** - 路由管理
- **Axios** - 用於 API 請求
- **DaisyUI** - UI 元件庫

### 主要設定

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
    },
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### 前端程式主架構

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import { useLoginStore } from "@/stores/userStore";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
const loginStore = useLoginStore();
loginStore.loadFromLocalStorage(); // 還原登入狀態

app.use(router);
app.mount("#app");
```

## 部署

### 前端

前端已部署至 **Vercel**：[Shopping Web Grok](https://vercel.com/final898y-gmailcoms-projects/shopping-web-grok)

### 後端

後端採用 **Node.js + Express**，並部署至 **Azure App Service**：

- GitHub Repo: [TradePlatformBackEnd](https://github.com/final898y/TradePlatformBackEnd)
- API 服務：[TradeBackend API](https://tradebackendapitest-f7djcbgmc0f5hrfv.japaneast-01.azurewebsites.net/)

## 開發與建置指令

在專案根目錄中執行以下指令：

- **開發模式**: `npm run dev`
- **建置**: `npm run build`
- **預覽模式**: `npm run preview`

## 目前進度

- ✅ Google 第三方登入
- ✅ 基本畫面架構
- ⏳ 功能開發中...

## 貢獻方式

如果有任何改進建議或 Bug 回報，請在 GitHub 上提交 Issue 或 PR！
