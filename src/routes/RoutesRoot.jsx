import { lazy } from 'react'
import { Layout } from '../ui/Layout.jsx'

const Home = lazy(() => import('../screens/Home.jsx'))
const Products = lazy(() => import('../screens/Products.jsx'))
const ProductView = lazy(() => import('../screens/ProductView.jsx'))
const CartPage = lazy(() => import('../screens/CartPage.jsx'))
const Checkout = lazy(() => import('../screens/Checkout.jsx'))
const Login = lazy(() => import('../screens/Login.jsx'))
const Register = lazy(() => import('../screens/Register.jsx'))
const Admin = lazy(() => import('../screens/admin/AdminDashboard.jsx'))
const AdminLogin = lazy(() => import('../screens/admin/AdminLogin.jsx'))

export const RoutesRoot = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products', element: <Products /> },
      { path: '/product/:slug', element: <ProductView /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/admin', element: <AdminGuard><Admin /></AdminGuard> },
      { path: '/admin/login', element: <AdminLogin /> },
    ],
  },
]

import { useStore } from '../store/store.js'

function AdminGuard({ children }) {
  const user = useStore((s) => s.user)
  if (!user || user.role !== 'admin') {
    return <div className="container py-16"><a className="btn" href="/admin/login">Go to Admin Login</a></div>
  }
  return children
}


