import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../lib/api.js'
import { useStore } from '../store/store.js'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setUser = (u) => useStore.setState({ user: u })

  const handleLogin = async () => {
    try {
      const res = await api.login({ email, password })
      if (!res?.token) throw new Error('Invalid email or password.')
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      setUser(res.user)
      toast.success('Signed in successfully.')
      if (res.user?.role === 'admin') navigate('/admin')
      else navigate('/')
    } catch (e) { toast.error(e.message || 'Login failed. Please try again.') }
  }

  return (
    <section className="container py-10">
      <div className="grid overflow-hidden rounded-2xl shadow-xl  bg-white max-w-4xl mx-auto md:grid-cols-2">
        {/* Left: Form */}
        <div className="p-10 lg:p-12">
          <div className="flex items-center gap-2 mb-8">
            
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account to continue.</p>

          <div className="mt-8 grid gap-5">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
              <input id="login-email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input id="login-password" className="input" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className='text-right mt-2'><a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline">Forgot password?</a></div>
            </div>

            <button className="btn btn-primary mt-3 py-2.5 font-semibold" onClick={handleLogin}>
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 relative">
            <span className="bg-white px-2 relative z-10">Or continue with</span>
            <div className='absolute inset-y-1/2 w-full border-t border-gray-200'></div>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <button className="h-11 w-11 rounded-full border border-gray-300 hover:border-indigo-500 transition"><img alt="Google" className="mx-auto h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" /></button>
            <button className="h-11 w-11 rounded-full border border-gray-300 hover:border-indigo-500 transition"><img alt="X (Twitter)" className="mx-auto h-5" src="https://www.svgrepo.com/show/475689/twitter-color.svg" /></button>
            <button className="h-11 w-11 rounded-full border border-gray-300 hover:border-indigo-500 transition"><img alt="Facebook" className="mx-auto h-5" src="https://www.svgrepo.com/show/475647/facebook-color.svg" /></button>
          </div>

          <p className="mt-8 text-sm text-center text-gray-500">
            Don't have an account? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Sign up here</Link>
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="relative hidden md:block bg-indigo-50">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&auto=format&fit=crop&q=60"
            alt="product illustration"
            className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply opacity-70"
          />
          <div className="absolute inset-0 bg-indigo-600/20" />
        </div>
      </div>
    </section>
  )
}