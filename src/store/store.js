import { create } from 'zustand'

const imagePool = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=60', // sneakers
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&auto=format&fit=crop&q=60', // jewelry
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=60', // watch
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=60', // tech
  'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1200&auto=format&fit=crop&q=60', // camera
  'https://images.unsplash.com/photo-1520975922324-48bb838b0fb6?w=1200&auto=format&fit=crop&q=60', // bag
]

const demoProducts = Array.from({ length: 24 }).map((_, i) => {
  const id = i + 1
  const price = 50 + (i % 9) * 15
  const sizes = ['sm','md','lg','xl']
  const colours = ['black','white','gold','rose']
  return {
    id,
    name: `Product ${id}`,
    slug: `product-${id}`,
    description: 'Elegant piece with premium build and timeless aesthetics.',
    tags: id % 2 ? ['trending','new'] : ['popular'],
    price,
    colour: colours[i % colours.length],
    role: 'admin',
    size: sizes[i % sizes.length],
    images: [
      imagePool[i % imagePool.length],
      imagePool[(i + 1) % imagePool.length],
      imagePool[(i + 2) % imagePool.length],
    ],
    inStock: true,
    totalStock: 100,
    soldCount: 10 * (i % 6),
  }
})

const persisted = JSON.parse(localStorage.getItem('app_state') || '{}')

export const useStore = create((set, get) => ({
  products: persisted.products || demoProducts,
  cart: persisted.cart || [],
  user: persisted.user || null,

  addToCart: (product, variantKey = '') => {
    const key = `${product.id}:${variantKey}`
    const existing = get().cart.find((c) => c.key === key)
    let next
    if (existing) {
      next = get().cart.map((c) => (c.key === key ? { ...c, qty: c.qty + 1 } : c))
    } else {
      next = [...get().cart, { key, product, qty: 1, variantKey }]
    }
    set({ cart: next })
    get().persist()
  },

  removeFromCart: (key) => {
    const next = get().cart.filter((c) => c.key !== key)
    set({ cart: next })
    get().persist()
  },

  updateQty: (key, qty) => {
    const next = get().cart.map((c) => (c.key === key ? { ...c, qty } : c))
    set({ cart: next })
    get().persist()
  },

  clearCart: () => {
    set({ cart: [] })
    get().persist()
  },

  // Auth (simple client-only admin toggle)
  loginAdmin: (email, password) => {
    // Demo credentials. Replace with real API later.
    if (email && password) {
      const user = { id: 'admin-1', role: 'admin', email }
      set({ user })
      get().persist()
      return { ok: true }
    }
    return { ok: false, error: 'Invalid credentials' }
  },
  logout: () => {
    set({ user: null })
    get().persist()
  },

  // Admin CRUD over products (local demo)
  addProduct: (data) => {
    const next = [...get().products, { ...data, id: Date.now(), slug: data.slug || `p-${Date.now()}` }]
    set({ products: next })
    get().persist()
  },
  updateProduct: (id, data) => {
    const next = get().products.map((p) => (p.id === id ? { ...p, ...data } : p))
    set({ products: next })
    get().persist()
  },
  deleteProduct: (id) => {
    const next = get().products.filter((p) => p.id !== id)
    set({ products: next })
    get().persist()
  },

  persist: () => {
    const { products, cart, user } = get()
    localStorage.setItem('app_state', JSON.stringify({ products, cart, user }))
  },
}))


