export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T; // optional，因為有些錯誤回應可能沒 data
  errordetail?: string;
  stack?: string;
};

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.success === "boolean" &&
    typeof obj.message === "string" &&
    ("data" in obj || obj.data === undefined) // 可選欄位的簡單驗證方式
  );
}

export function isApiResponseOfType<T>(
  obj: any,
  typeCheck: (value: any) => boolean
): obj is ApiResponse<T> {
  return (
    obj &&
    typeof obj.success === "boolean" &&
    typeof obj.message === "string" &&
    (obj.data === undefined || typeCheck(obj.data)) // 檢查 data 是否符合型別
  );
}
