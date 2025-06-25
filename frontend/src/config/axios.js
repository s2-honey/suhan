// src/config/axios.js
import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';

const instance = axios.create({
  baseURL: isLocal ? 'http://localhost:8085' : 'http://211.188.59.173:8085',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔥 이거 유지하는 게 안전함!
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
