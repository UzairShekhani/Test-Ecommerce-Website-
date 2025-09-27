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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Professional Header */}
      <header className="sticky top-0 z-50  bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3 font-bold">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg transition-transform group-hover:scale-105 flex items-center justify-center">
                <span className="text-white text-sm font-bold">UM</span>
              </div>
              <span className="text-xl tracking-tight">UrbannMuse</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  `px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/products" 
                className={({isActive}) => 
                  `px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink 
                to="/categories" 
                className={({isActive}) => 
                  `px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`
                }
              >
                Categories
              </NavLink>
              {user && (
                <>
                  <NavLink 
                    to="/favorites" 
                    className={({isActive}) => 
                      `px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                        isActive 
                          ? "bg-indigo-50 text-indigo-700" 
                          : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    Favorites
                  </NavLink>
                  <NavLink 
                    to="/orders" 
                    className={({isActive}) => 
                      `px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                        isActive 
                          ? "bg-indigo-50 text-indigo-700" 
                          : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    Orders
                  </NavLink>
                </>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 hidden sm:inline font-medium">
                    Welcome, <span className="text-gray-900">{user.username}</span>
                  </span>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <NavLink 
                    to="/login" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
              
              {/* Cart Button */}
              <Link 
                to="/cart" 
                className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full min-w-5 h-5">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-24">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">UM</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">UrbannMuse</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Discover unique fashion and lifestyle products that inspire your urban style. Quality, creativity, and authenticity in every piece.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.246.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.631 2.186 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.631-.167 5.65-2.186 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.246 17.814.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.67-.009 2.986-.057 4.04-.124 2.69-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.975 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Shop */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Shop</h3>
                <ul className="space-y-3">
                  <li><Link to="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">All Products</Link></li>
                  <li><Link to="/categories" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Categories</Link></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">New Arrivals</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sale</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Size Guide</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Shipping & Returns</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Track Your Order</a></li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About Us</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Press</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sustainability</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Affiliate Program</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-gray-200 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Stay in the loop</h3>
                <p className="text-sm text-gray-600">Subscribe to our newsletter for the latest updates and exclusive offers.</p>
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-gray-500">
                © 2025 UrbannMuse. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
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