import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.js'
import { ShoppingCartIcon } from './icons/ShoppingCartIcon.jsx'
import { Suspense } from 'react'

export function Layout() {
  const user = useStore((s)=>s.user)
  const setUser = (u)=>useStore.setState({ user: u })
  const navigate = useNavigate()
  const cartItemCount = useStore((s) => s.cart.reduce((sum, item) => sum + item.qty, 0))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user') 
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2 font-semibold">
            <span className="h-8 w-8 rounded-lg bg-gray-900 transition group-hover:scale-95" />
            <span className="text-lg">UrbannMuse</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/products" className={({isActive})=>isActive?"font-medium":"text-gray-600 hover:text-gray-900"}>Products</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600 hidden sm:inline">Hi, {user.username}</span>
                <button className="btn-outline" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <nav className="hidden md:flex items-center gap-4 text-sm">
                <NavLink to="/login" className={({isActive})=>isActive?"font-medium":"text-gray-600 hover:text-gray-900"}>Login</NavLink>
                <NavLink to="/register" className={({isActive})=>isActive?"font-medium":"text-gray-600 hover:text-gray-900"}>Signup</NavLink>
              </nav>
            )}
            <Link to="/cart" className="btn btn-outline gap-2 relative">
              <ShoppingCartIcon className="h-5 w-5" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <main className="pb-12">
        <Suspense fallback={<div className="container py-24">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t bg-white">
        <div className="container py-8 text-sm text-gray-600">© 2025 Shop</div>
      </footer>
    </div>
  )
}

// --- Main App Setup ---

export default function App() {
  // Use a mock base path for the BrowserRouter for canvas compatibility
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<div className="container py-16 text-center text-2xl font-bold">404 - Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}