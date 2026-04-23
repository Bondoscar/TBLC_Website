// Centralized API client for TBLC
import axios from 'axios';

const BACKEND = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND}/api`;

// Token lives in localStorage so admin session persists across reloads
const TOKEN_KEY = 'tblc_admin_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

const instance = axios.create({ baseURL: API_BASE });
instance.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Public
export const fetchBootstrap = () =>
  instance.get(`/bootstrap?t=${Date.now()}`).then((r) => r.data);
export const fetchEvents = (published = true) =>
  instance.get(`/events?published=${published}`).then((r) => r.data);
export const fetchMinistries = (published = true) =>
  instance.get(`/ministries?published=${published}`).then((r) => r.data);
export const fetchSermons = (published = true) =>
  instance.get(`/sermons?published=${published}`).then((r) => r.data);
export const fetchPastors = (published = true) =>
  instance.get(`/pastors?published=${published}`).then((r) => r.data);
export const fetchNewsletters = (published = true) =>
  instance.get(`/newsletters?published=${published}`).then((r) => r.data);
export const fetchSettings = () => instance.get('/settings').then((r) => r.data);

// Admin
export const adminLogin = (password) =>
  instance.post('/admin/login', { password }).then((r) => r.data);
export const adminMe = () => instance.get('/admin/me').then((r) => r.data);
export const resolveDrive = (url, kind = 'image') =>
  instance.post('/admin/resolve-drive', { url, kind }).then((r) => r.data);

// CRUD factory (shared by admin tabs)
const makeCrud = (resource) => ({
  list: () => instance.get(`/${resource}`).then((r) => r.data),
  create: (body) => instance.post(`/${resource}`, body).then((r) => r.data),
  update: (id, body) => instance.put(`/${resource}/${id}`, body).then((r) => r.data),
  remove: (id) => instance.delete(`/${resource}/${id}`).then((r) => r.data),
});

export const eventsApi = makeCrud('events');
export const ministriesApi = makeCrud('ministries');
export const sermonsApi = makeCrud('sermons');
export const pastorsApi = makeCrud('pastors');
export const newslettersApi = makeCrud('newsletters');

export const settingsApi = {
  getAll: () => instance.get('/settings').then((r) => r.data),
  put: (key, value) =>
    instance.put(`/settings/${key}`, { value }).then((r) => r.data),
};

export default instance;
