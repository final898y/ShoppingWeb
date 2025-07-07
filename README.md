# Shopping Web

## 簡介

Shopping Web 是一個基於 **Vue 3** 的前端購物網站，採用 **Vite** 進行開發，並整合 **Tailwind CSS** 和 **DaisyUI** 作為 UI 樣式框架。此專案旨在打造一個功能完整的電商平台，目前已實現 Google 第三方登入、商品瀏覽、購物車管理、分類篩選、結帳流程和訂單查詢等功能。

## 項目架構

### 前端技術

- **Vue 3** - 主框架，使用組合式 API 和 `<script setup>` 語法。
- **Vite** - 開發與建置工具，提供快速的開發體驗。
- **Tailwind CSS** - 樣式框架，實現響應式設計。
- **DaisyUI** - UI 元件庫，提供一致的視覺風格。
- **Pinia** - 狀態管理，支援 Setup Store 語法，管理商品、購物車、訂單和用戶數據。
- **Vue Router** - 路由管理，支援動態路由、404 頁面和路由守衛。
- **Axios** - 用於後端 API 請求，支援健康狀態檢查和用戶認證。
- **TypeScript** - 提供型別安全，定義商品、分類和購物車的介面。
- **Zod** - 用於後端 API 回應的資料驗證，確保資料一致性。

### 主要設定 (`vite.config.ts`)

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

const isLocal = process.env.NODE_ENV !== "production";

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  server: isLocal
    ? {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
          cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
        },
        port: 5173,
      }
    : {
        port: 5173,
      },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### 前端程式主架構 (`src/main.ts`)

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

async function initApp() {
  const loginStore = useLoginStore();
  const productStore = useProductStore();
  const cartStore = useCartStore();

  loginStore.loadFromLocalStorage();
  await cartStore.loadFromServer("19de471a-2391-4205-baa9-774a691ca256");

  app.use(router);
  app.mount("#app");
}

initApp();
```

## 功能概覽

- **商品瀏覽**：
  - 首頁 (`Home.vue`) 顯示商品卡片，包含縮略圖、名稱和價格。
  - 支援透過側邊欄 (`Aside.vue`) 篩選分類和子分類，動態更新商品陳列。
  - 商品詳情頁 (`Product.vue`) 顯示詳細資訊，支援加入購物車。
- **購物車管理**：
  - 購物車頁面 (`Cart.vue`) 顯示商品列表，支援修改數量、移除商品和清空購物車。
  - 購物車資料與後端同步，確保資料一致性。
- **結帳流程**：
  - 結帳頁面 (`Checkout.vue`) 提供表單讓使用者填寫收件人資訊。
  - 訂單確認頁面 (`CheckoutConfirm.vue`) 顯示最終訂單詳情。
  - 整合 **ECPay** 金流，引導使用者至第三方支付頁面完成付款。
- **會員功能**：
  - 支援 Google 第三方登入 (`Login.vue`)。
  - 會員中心 (`MemberCenter.vue`) 顯示使用者基本資料。
  - 訂單查詢頁面 (`Orders.vue`) 列出使用者的歷史訂單。
- **錯誤處理**：
  - 404 頁面 (`NotFound.vue`) 處理無效商品 ID 和無效路由。
- **用戶介面**：
  - 頭部導航 (`Header.vue`) 包含搜尋框、購物車連結（顯示商品數量）、登入/登出和健康狀態指示器。
  - 使用 DaisyUI 的卡片、按鈕和徽章，確保視覺一致性。
- **狀態管理**：
  - 使用 Pinia 的 Setup Store 管理商品 (`productStore`)、購物車 (`cartStore`)、訂單 (`orderStore`) 和使用者 (`userStore`)。
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
- ✅ 結帳流程 (ECPay)
- ✅ 後端 API 整合
- ✅ 會員中心與訂單查詢
- ⏳ 搜尋功能

## 貢獻方式

如果有任何改進建議或 Bug 回報，請在 GitHub 上提交 Issue 或 PR！

## 許可證

本專案採用 MIT License，詳見 [LICENSE.md](./LICENSE.md) 檔案。
