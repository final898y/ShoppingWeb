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
    ("data" in obj || obj.data === undefined) && // 可選欄位的簡單驗證方式
    ("errordetail" in obj || obj.errordetail === undefined) &&
    ("stack" in obj || obj.stack === undefined)
  );
}

export function isApiResponseOfType<T>(
  obj: any,
  typeCheck: (value: any) => boolean
): obj is ApiResponse<T> {
  return (
    obj !== null &&
    typeof obj === "object" &&
    typeof obj.success === "boolean" &&
    typeof obj.message === "string" &&
    obj.data !== undefined && // Require data to be present
    typeCheck(obj.data) && // Ensure data passes typeCheck
    (obj.errordetail === undefined || typeof obj.errordetail === "string") &&
    (obj.stack === undefined || typeof obj.stack === "string")
  );
}

export type UserDataType = {
  mobilephone: string;
  email: string;
};

export function isUserData(data: any): data is UserDataType {
  return (
    data !== null &&
    data !== undefined &&
    typeof data === "object" &&
    typeof data.mobilephone === "string" &&
    typeof data.email === "string"
  );
}
