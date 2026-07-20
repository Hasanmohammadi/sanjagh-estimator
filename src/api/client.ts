import type { ApiError, ApiResponse } from "@/types/Api";
import toast from "@/utils/toast";

import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add token or other headers here if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    const apiResponse = response.data as ApiResponse<unknown>;

    // Check if API returned error in the body
    if (apiResponse.status === "error" && apiResponse.error) {
      toast.error(`"❌ خطا:", ${apiResponse.error.fa}`);
      return Promise.reject(apiResponse.error);
    }

    return response;
  },
  error => {
    if (error.response) {
      const apiResponse = error.response.data as ApiResponse<unknown>;

      // Log Farsi error if available
      if (apiResponse?.error?.fa) {
        toast.error(`"❌ خطا:", ${apiResponse.error.fa}`);
      } else {
        toast.error(`"❌ خطای ناشناخته::", ${error.message}`);
      }

      // Handle different status codes
      switch (error.response.status) {
        case 401:
          toast.error("❌ خطا: لطفاً ابتدا وارد حساب کاربری خود شوید");
          // Redirect to login if needed
          // window.location.href = "/login";
          break;
        case 403:
          toast.error("❌ خطا: دسترسی غیرمجاز");
          break;
        case 404:
          toast.error("❌ خطا: منبع مورد نظر یافت نشد");
          break;
        case 500:
          toast.error("❌ خطا: مشکل در سرور، لطفاً بعداً تلاش کنید");
          break;
      }

      return Promise.reject(apiResponse?.error || error);
    }

    if (error.request) {
      toast.error("❌ خطا: اتصال به سرور برقرار نشد");
      return Promise.reject({ fa: "اتصال به سرور برقرار نشد", en: "No response from server" } as ApiError);
    }

    toast.error("❌ خطا:", error.message);
    return Promise.reject({ fa: "خطای ناشناخته", en: error.message } as ApiError);
  },
);
