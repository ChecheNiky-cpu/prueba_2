import { projectId } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server`;;
export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  products: {
    getAll: (token: string) =>
      api.request('/products', { headers: { Authorization: `Bearer ${token}` } }),

    create: (token: string, product: any) =>
      api.request('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
      }),

    update: (token: string, id: string, data: any) =>
      api.request(`/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      }),

    delete: (token: string, id: string) =>
      api.request(`/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
  },

  auth: {
    signup: (email: string, password: string, name: string, anonKey: string) =>
      api.request('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${anonKey}` },
        body: JSON.stringify({ email, password, name })
      })
  }
};
