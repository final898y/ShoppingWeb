import { API_BASE_URL } from "@/config";

const getCsrfTokenFromServer = async (): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/auth/getCsrfToken`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`無法取得 CSRF Token，狀態碼：${res.status}`);
  }

  const responsedata = await res.json();
  if (!responsedata.success) {
    throw new Error("CSRF Token 回傳失敗");
  }

  console.log("✅ CSRF Token 已取得");
  return responsedata.data;
};

const CsrfTokenManager = (() => {
  let csrfToken: string | null = null;

  const getTokenWithRetry = async (retries = 2): Promise<string> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const token = await getCsrfTokenFromServer();
        return token;
      } catch (err) {
        console.warn(`⚠️ 第 ${attempt + 1} 次嘗試失敗`, err);
        if (attempt === retries) {
          throw new Error("❌ 無法取得 CSRF Token（已重試多次）");
        }
        // 等待一點時間再試（可選）
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    return "";
  };

  return {
    getToken: async (): Promise<string> => {
      if (!csrfToken) {
        try {
          csrfToken = await getTokenWithRetry();
        } catch (err) {
          console.error("❌ getTokenWithRetry 失敗", err);
          csrfToken = null;
          return "";
        }
      }
      return csrfToken;
    },
  };
})();

export const setcsrfTokenAsRequestBody = async (): Promise<URLSearchParams> => {
  try {
    const token = await CsrfTokenManager.getToken();
    const body = new URLSearchParams();

    body.append("g_csrf_token", token);
    return body;
  } catch (err) {
    console.error("❌ 無法設置 CSRF Token:", err);
    return new URLSearchParams();
  }
};
