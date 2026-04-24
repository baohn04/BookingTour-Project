import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from './cookie';

const API_DOMAIN = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_DOMAIN,
  timeout: 15000,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    config.headers['Accept'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Không có response
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('auth/login') &&
      !originalRequest.url.includes('auth/refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        ).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          API_DOMAIN + 'admin/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        if (!data.accessToken) throw new Error('No access token returned');

        setCookie('accessToken', data.accessToken, 1);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        deleteCookie('accessToken');
        window.location.href = '/admin/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response ? error.response.data : error);
  }
);

export const get = (path) => axiosInstance.get(path);
export const post = (path, data) => axiosInstance.post(path, data);
export const put = (path, data) => axiosInstance.put(path, data);
export const patch = (path, data) => axiosInstance.patch(path, data);
export const postForm = (path, form) => axiosInstance.post(path, form);
export const patchForm = (path, form) => axiosInstance.patch(path, form);
export const del = (path) => axiosInstance.delete(path);