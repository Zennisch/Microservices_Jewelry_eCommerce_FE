import { IBackendRes } from "@/types/backend";
import { Mutex } from "async-mutex";
import axiosClient from "axios";
import { store } from "@/redux/store";
import { setRefreshTokenAction } from "@/redux/slice/accountSlide";
import { notification } from "antd";
interface AccessTokenResponse {
    access_token: string;
}

/**
 * Creates an initial 'axios' instance with custom settings.
 */

const instance = axiosClient.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true
});

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get<IBackendRes<AccessTokenResponse>>('/api/v1/auth/refresh');
        if (res && res.data) return res.data.access_token;
        else return null;
    });
};

instance.interceptors.request.use(function (config) {
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
});
// ... existing code ...

// instance.interceptors.response.use(
//     (res) => res.data,
//     async (error) => {
//         // Add handling for OAuth redirects
//         if (error.response && error.response.status === 302) {
//             const redirectUrl = error.response.headers.location;
//             if (redirectUrl && redirectUrl.includes('oauth2/authorization')) {
//                 window.location.href = redirectUrl;
//                 return;
//             }
//         }
        
//         // ... rest of your existing error handling ...
//     }
// );

// ... rest of the file ...
// instance.interceptors.request.use(
//     function (config) {
//       // Check if token exists in localStorage
//       const token = localStorage.getItem('access_token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     function (error) {
//       return Promise.reject(error);
//     }
//   );
//   export const handleTokenFromURL = () => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get('token');
//     const userId = params.get('userId');
//     const email = params.get('email');
//     const name = params.get('name');
//     const role = params.get('role');
  
//     if (token) {
//       localStorage.setItem('access_token', token);
      
//       // Store user info
//       if (userId && email && name) {
//         const userInfo = {
//           id: userId,
//           email,
//           name,
//           role: role || 'ROLE_USER'
//         };
//         localStorage.setItem('user_info', JSON.stringify(userInfo));
//       }
      
//       // Clean up URL
//       window.history.replaceState({}, document.title, window.location.pathname);
//       return true;
//     }
//     return false;
//   };
/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        if (error.config && error.response
            && +error.response.status === 401
            && error.config.url !== '/api/v1/auth/login'
            && !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = 'true'
            if (access_token) {
                error.config.headers['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('access_token', access_token)
                return instance.request(error.config);
            }
        }

        if (
            error.config && error.response
            && +error.response.status === 400
            && error.config.url === '/api/v1/auth/refresh'
            && location.pathname.startsWith("/admin")
        ) {
            const message = error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng login.";
            //dispatch redux action
            store.dispatch(setRefreshTokenAction({ status: true, message }));
        }

        if (+error.response.status === 403) {
            notification.error({
                message: error?.response?.data?.message ?? "",
                description: error?.response?.data?.error ?? ""
            })
        }

        return error?.response?.data ?? Promise.reject(error);
    }
);

/**
 * Replaces main `axios` instance with the custom-one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
// const axios = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);

// export default axios;

export default instance;