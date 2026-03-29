/**
 * Axios instance with JWT injection and consistent error surfacing.
 */
import axios from 'axios';
import { API_BASE } from '../utils/constants.js';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);
