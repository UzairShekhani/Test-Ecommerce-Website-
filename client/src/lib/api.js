const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-backend-production-5560.up.railway.app'

async function request(path, { method = 'GET', token, body, isForm } = {}) {
  const headers = {}
  if (!isForm) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let err
    try { err = await res.json() } catch { err = { error: res.statusText } }
    throw new Error(err.error || 'Request failed')
  }
  try { return await res.json() } catch { return null }
}

export const api = {
  register: (data) => request('/api/auth/register', { method: 'POST', isForm: true, body: data }),
  login: (data) => request('/api/auth/login', { method: 'POST', body: data }),
  adminLogin: (data) => request('/api/auth/admin-login', { method: 'POST', body: data }),
  products: ({ page = 1, limit = 12, sort = 'popular', q, tag } = {}) => {
    const params = new URLSearchParams({ page, limit, sort })
    if (q) params.set('q', q)
    if (tag) params.set('tag', tag)
    return request(`/api/products?${params.toString()}`)
  },
  productBySlug: (slug) => request(`/api/products/slug/${slug}`),
  createProduct: (form, token) => request('/api/products', { method: 'POST', isForm: true, body: form, token }),
  updateProduct: (id, formOrJson, token, isForm = false) =>
    request(`/api/products/${id}`, { method: 'PATCH', isForm, body: formOrJson, token }),
  deleteProduct: (id, token) => request(`/api/products/${id}`, { method: 'DELETE', token }),

  // Favorites APIs
  getFavorites: (token) => request('/api/favorites', { token }),
  addFavorite: (productId, token) => request('/api/favorites', { method: 'POST', body: { productId }, token }),
  removeFavorite: (productId, token) => request(`/api/favorites/${productId}`, { method: 'DELETE', token }),
}


