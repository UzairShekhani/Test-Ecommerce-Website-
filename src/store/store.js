import { create } from 'zustand'

// ... (imagePool aur demoProducts ka code same rahega) ...
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

// --- NAYA INITIAL LOAD LOGIC ---
// 1. Check if token exists
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; 

// 2. Load persisted state
const persisted = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem('app_state') || '{}') : 
    {};

// 3. Conditional user load: Agar token nahi hai, toh user bhi nahi hona chahiye.
const initialUser = token ? persisted.user : null; 
// --------------------------------

export const useStore = create((set, get) => ({
    products: persisted.products || demoProducts,
    cart: persisted.cart || [],
    user: initialUser || null, // Naya initial user state
    favorites: persisted.favorites || [],

    // --- Cart Actions (Same) ---
    addToCart: (product, variantKey = '') => {
        // ... (cart logic)
        const key = `${product.id}:${variantKey}`
        const existing = get().cart.find((c) => c.key === key)
        let next
        if (existing) {
            next = get().cart.map((c) => 
                c.key === key ? { ...c, qty: c.qty + 1 } : c
            )
        } else {
            next = [...get().cart, { key, product, qty: 1, variantKey }]
        }
        set({ cart: next })
        get().persist()
    },

    removeFromCart: (key) => {
        // ... (cart logic)
        const next = get().cart.filter((c) => c.key !== key)
        set({ cart: next })
        get().persist()
    },

    updateQty: (key, qty) => {
        // ... (cart logic)
        const next = get().cart.map((c) => 
            c.key === key ? { ...c, qty } : c
        )
        set({ cart: next })
        get().persist()
    },

    clearCart: () => {
        // ... (cart logic)
        set({ cart: [] })
        get().persist()
    },

    // --- Auth ---
    loginAdmin: (email, password) => {
        // Demo credentials — replace with real API later
        if (email && password) {
            const user = { id: 'admin-1', role: 'admin', email }
            // Token save karna yahan theek hai
            localStorage.setItem("token", "demo-token") 
            set({ user })
            get().persist()
            return { ok: true }
        }
        return { ok: false, error: 'Invalid credentials' }
    },

    logout: () => {
        // Token remove karna
        localStorage.removeItem("token")
        // User state ko null set karna
        set({ user: null }) 
        // Persist function call karna, jo ab user: null save karega
        get().persist() 
    },

    // --- Product CRUD (Same) ---
    addProduct: (data) => {
        // ... (product logic)
        const next = [
            ...get().products, 
            { ...data, id: Date.now(), slug: data.slug || `p-${Date.now()}` }
        ]
        set({ products: next })
        get().persist()
    },

    updateProduct: (id, data) => {
        // ... (product logic)
        const next = get().products.map((p) => 
            p.id === id ? { ...p, ...data } : p
        )
        set({ products: next })
        get().persist()
    },

    deleteProduct: (id) => {
        // ... (product logic)
        const next = get().products.filter((p) => p.id !== id)
        set({ products: next })
        get().persist()
    },

    // --- Favorites Actions (Same) ---
    addFavorite: (product) => {
        // ... (favorite logic)
        set((state) => ({ favorites: [...state.favorites, product] }))
        get().persist()
    },

    removeFavorite: (productId) => {
        // ... (favorite logic)
        set((state) => ({ favorites: state.favorites.filter((p) => p.id !== productId) }))
        get().persist()
    },

    // --- Persist state to localStorage ---
    persist: () => {
        const { products, cart, favorites } = get()
        const stateToSave = { products, cart, favorites }
        localStorage.setItem('app_state', JSON.stringify(stateToSave))
    },
}))