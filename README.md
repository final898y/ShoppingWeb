# Shopping Web

## 簡介

Shopping Web 是一個基於 **Vue 3** 的前端購物網站，採用 **Vite** 進行開發，並整合 **Tailwind CSS** 和 **DaisyUI** 作為 UI 樣式框架。此專案旨在打造一個功能完整的電商平台，目前已實現 Google 第三方登入、商品瀏覽、購物車管理和分類篩選等功能。

## 項目架構

### 前端技術

- **Vue 3** - 主框架，使用組合式 API 和 `<script setup>` 語法。
- **Vite** - 開發與建置工具，提供快速的開發體驗。
- **Tailwind CSS** - 樣式框架，實現響應式設計。
- **DaisyUI** - UI 元件庫，提供一致的視覺風格。
- **Pinia** - 狀態管理，支援 Setup Store 語法，管理商品、購物車和用戶數據。
- **Vue Router** - 路由管理，支援動態路由和 404 頁面。
- **Axios** - 用於後端 API 請求，支援健康狀態檢查和用戶認證。
- **TypeScript** - 提供型別安全，定義商品、分類和購物車的介面。

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
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
const loginStore = useLoginStore();
const productStore = useProductStore();
const cartStore = useCartStore();
loginStore.loadFromLocalStorage(); // 還原登入狀態
productStore.loadFromLocalStorage(); // 還原商品和分類數據
cartStore.loadFromLocalStorage(); // 還原購物車數據

app.use(router);
app.mount("#app");
```

## 功能概覽

- **商品瀏覽**：
  - 首頁 (`Home.vue`) 顯示商品卡片，包含縮略圖、名稱和價格。
  - 支援透過側邊欄 (`Aside.vue`) 篩選分類和子分類，動態更新商品陳列。
  - 商品詳情頁 (`Product.vue`) 顯示詳細資訊，支援加入購物車。
- **購物車管理**：
  - 購物車頁面 (`Cart.vue`) 顯示商品列表，支援修改數量、移除商品和清空購物車。
  - 計算總金額並儲存至 localStorage。
- **錯誤處理**：
  - 404 頁面 (`NotFound.vue`) 處理無效商品 ID 和無效路由。
- **用戶介面**：
  - 頭部導航 (`Header.vue`) 包含搜尋框、購物車連結（顯示商品數量）、登入/登出和健康狀態指示器。
  - 使用 DaisyUI 的卡片、按鈕和徽章，確保視覺一致性。
- **狀態管理**：
  - 使用 Pinia 的 Setup Store 管理商品 (`productStore`) 和購物車 (`cartStore`)。
  - 支援分類篩選，動態更新首頁商品。
- **可訪問性**：
  - 為按鈕和連結添加 `aria-label`，提升無障礙體驗。

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
- ✅ 基本畫面架構（首頁、商品詳情、購物車、404 頁面）
- ✅ 分類篩選功能
- ✅ 購物車功能（新增、修改數量、移除、清空）
- ✅ 購物車數量顯示
- ⏳ 搜尋功能
- ⏳ 結帳流程
- ⏳ 後端 API 整合

## 貢獻方式

如果有任何改進建議或 Bug 回報，請在 GitHub 上提交 Issue 或 PR！
