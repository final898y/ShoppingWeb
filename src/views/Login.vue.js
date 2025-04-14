import { ref } from "vue";
import { onMounted } from "vue";
onMounted(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
        if (window.google) {
            console.log("Google Sign-In script loaded successfully");
        }
        else {
            console.error("Google Sign-In script failed to load");
        }
        window.google.accounts.id.initialize({
            client_id: "359200533687-87lah0su6ufvh34gi1c14mt0sudrpp21.apps.googleusercontent.com", // ← 換成你自己的 client_id
            callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(document.getElementById("gsi-button"), 
        // customization attributes
        {
            theme: "filled_black",
            size: "large",
            type: "standard",
            width: "336",
            locale: "en-US",
        });
        window.google.accounts.id.prompt(); // also display the One Tap dialog
    };
    document.head.appendChild(script);
    // 在頁面載入時生成並儲存 CSRF token
    // const isSecure = window.location.protocol === "https:";
    // document.cookie = `g_csrf_token=${setCsrfToken}; Path=/; SameSite=${
    //   isSecure ? "None" : "Lax"
    // }${isSecure ? "; Secure" : ""}`;
    //document.cookie = `g_csrf_token=${setCsrfToken}; SameSite=Lax; Path=/`;
    // document.cookie = `g_csrf_token=${setCsrfToken}; SameSite=None; Secure; Path=/`;
});
// Email and password data
const email = ref("");
const password = ref("");
const getCsrfTokenFromServer = async () => {
    try {
        const res = await fetch("https://tradebackendfinal898y.azurewebsites.net/api/googleAuth/getCsrfToken", {
            credentials: "include",
        });
        if (!res.ok) {
            console.error(`⚠️ 無法取得 CSRF Token，狀態碼：${res.status}`);
            return null;
        }
        const data = await res.json();
        if (!data.success) {
            console.warn("⚠️ CSRF Token 回傳失敗：", data);
            return null;
        }
        console.log("✅ CSRF Token 已取得：", data.csrfToken);
        return data.csrfToken; // 直接傳回 token 而不是馬上讀 cookie
    }
    catch (err) {
        console.error("❌ 發生錯誤：無法從伺服器取得 CSRF Token", err);
        return null;
    }
};
// Handle the credential response from Google Sign-In
const handleCredentialResponse = async (response) => {
    const token = await getCsrfTokenFromServer();
    // 延遲讀取 cookie（保險起見）
    await new Promise((r) => setTimeout(r, 100));
    const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("g_csrf_token="))
        ?.split("=")[1] ?? token; // 用備援的 token
    if (!csrfToken) {
        console.warn("⚠️ 無法取得 CSRF Token，請檢查是否正確設置 cookie");
        return;
    }
    const body = new URLSearchParams();
    body.append("credential", response.credential);
    body.append("g_csrf_token", csrfToken);
    console.log(body);
    const res = await fetch("https://tradebackendfinal898y.azurewebsites.net/api/googleAuth/verifyGoogleIdToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
    });
    const result = await res.json();
    console.log(result);
};
// Handle form submission
function handleSubmit() {
    console.log("Submitting form", email.value, password.value);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen flex items-center justify-center bg-base-100" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card w-96 bg-base-200 shadow-xl" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "card-title justify-center mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-control" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "email",
    placeholder: "輸入您的電子郵件",
    ...{ class: "input input-bordered w-full" },
    required: true,
});
(__VLS_ctx.email);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-control mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "password",
    placeholder: "輸入您的密碼",
    ...{ class: "input input-bordered w-full" },
    required: true,
});
(__VLS_ctx.password);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-control mt-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn btn-primary w-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: "#",
    ...{ class: "link link-hover text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "divider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "gsi-button",
});
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-100']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['w-96']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base-200']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label-text']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-bordered']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label-text']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-bordered']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
/** @type {__VLS_StyleScopedClasses['link-hover']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            email: email,
            password: password,
            handleSubmit: handleSubmit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
