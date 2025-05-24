// src/utils/axios.ts
import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import router from "@/router"; // 注意：這裡要用絕對路徑或相對路徑，看你的設定
import { API_BASE_URL } from "@/config";

// 設置預設配置
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// 排隊請求的型別
interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: Array<FailedRequest> = [];

const processQueue = (refreshStatus: boolean, error?: AxiosError | unknown) => {
  // 遍歷隊列，根據有無 token 確定該如何處理每一個請求
  failedQueue.forEach(({ resolve, reject }) => {
    if (refreshStatus) {
      resolve(); // 如果有新 token，則成功解析並重發請求
    } else {
      reject(error); // 如果沒有 token，則拒絕該請求
    }
  });
  failedQueue = []; // 清空隊列，防止重複處理
};

// 請求攔截器
axios.interceptors.request.use(
  (config) => {
    // 可以在這裡處理請求，比如附加 Authorization 標頭
    // 例如：config.headers['Authorization'] = `Bearer ${token}`
    return config;
  },
  (error) => Promise.reject(error)
);

// 響應攔截器
axios.interceptors.response.use(
  (response) => response, // 正常響應，直接返回
  async (error) => {
    const originalRequest = error.config;
    // 如果是 401 錯誤，表示需要刷新 token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新 token，將當前請求加入等待隊列
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axios(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // 設置標誌，表示正在刷新 token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 嘗試刷新 token
        const response = await axios.post("auth/refresh");
        const refreshStatus = response.data.success; // 假設後端返回新 token

        // 如果刷新成功，處理排隊的請求
        processQueue(refreshStatus);

        return axios(originalRequest);
      } catch (refreshError) {
        // 如果刷新失敗，處理排隊的請求並跳轉到登入頁
        if (refreshError instanceof AxiosError) {
          // 如果是 AxiosError 類型
          processQueue(false, refreshError);
        } else {
          // 如果不是 AxiosError 類型，可以處理其他情況
          processQueue(false, refreshError); // 也可以使用 `null` 作為錯誤參數
        }
        router.push("/login");
        return Promise.reject(refreshError);
      } finally {
        // 重置刷新標誌
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
export default axios;
