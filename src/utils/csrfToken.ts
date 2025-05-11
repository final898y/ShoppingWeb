const getCsrfTokenFromServer = async (): Promise<string> => {
  const res = await fetch(
    "https://tradebackendapitest-f7djcbgmc0f5hrfv.japaneast-01.azurewebsites.net/api/auth/getCsrfToken",
    {
      method: "GET",
      credentials: "include",
    }
  );
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
    return ""; // 理論上不會走到這行
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

// function getCookie(name: string): string | undefined {
//   const cookies = document.cookie
//     .split("; ")
//     .map((cookie) => cookie.split("="));
//   const found = cookies.find(([key]) => key === name);
//   return found ? found[1] : undefined;
// }

// const waitForCookie = async (
//   cookieName: string,
//   retries = 3,
//   delayMs = 100
// ): Promise<string | undefined> => {
//   for (let i = 0; i < retries; i++) {
//     console.log(`⏳ Waiting for cookie...${retries}`);
//     const value = getCookie(cookieName);
//     if (value) return value;
//     await new Promise((res) => setTimeout(res, delayMs));
//   }
//   return undefined;
// };

export const setcsrfTokenAsRequestBody = async (): Promise<URLSearchParams> => {
  try {
    const token = await CsrfTokenManager.getToken();
    // const tokenInCookie = await waitForCookie("g_csrf_token");
    const body = new URLSearchParams();

    // if (!tokenInCookie) {
    //   console.error("❌ Cookie 中找不到 g_csrf_token");
    // } else if (token !== tokenInCookie) {
    //   console.error("❌ Token 不一致");
    //   console.log("token (from server):", token);
    //   console.log("g_csrf_token (from cookie):", tokenInCookie);
    // }

    body.append("g_csrf_token", token);
    return body;
  } catch (err) {
    console.error("❌ 無法設置 CSRF Token:", err);
    return new URLSearchParams(); // 避免拋出錯誤影響後續邏輯
  }
};
