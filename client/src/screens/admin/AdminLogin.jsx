import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useStore } from '../../store/store.js'
import { api } from '../../lib/api.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@store.com') // Hardcoded admin email
  const [password, setPassword] = useState('Admin@123') // Hardcoded admin password
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const setUser = (u) => useStore.setState({ user: u })
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await api.adminLogin({ email, password })
      if (!res?.token) throw new Error('No token returned')

      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      setUser(res.user)
      toast.success('Admin Login Successful!')
      navigate('/admin')
    } catch (e) {
      setError(e.message || 'Login failed')
      toast.error(e.message || 'Login Failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="grid md:grid-cols-2 max-w-5xl w-full overflow-hidden rounded-2xl border bg-white shadow-indigo-200/50">
            {/* Visual Side */}
            <div className="hidden md:flex flex-col justify-center items-center p-12 bg-indigo-700">
                <div className="text-white text-center">
                    <h3 className="text-4xl font-extrabold mb-3">Admin Portal</h3>
                    <p className="text-indigo-300 text-lg font-medium">Manage your e-commerce store with ease.</p>
                </div>
                {/* Placeholder SVG */}
                <svg className="w-4/5 h-auto mt-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 8h10M7 12h10M7 16h6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="15" cy="16" r="1" fill="#FFFFFF"/>
                </svg>
            </div>

            {/* Form Side */}
            <form onSubmit={onSubmit} className="p-10 lg:p-14">
                <h2 className="text-3xl font-extrabold text-gray-900">Admin Sign in</h2>
                <p className="mt-2 text-sm text-gray-500 font-medium">
                    Please sign in to continue. 
                    <span className="ml-1 font-semibold text-indigo-600">Use: admin@store.com / Admin@123</span>
                </p>
                
                {error && (
                    <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
                        {error}
                    </div>
                )}
                
                <div className="mt-8 grid gap-4">
                    <input 
                        type="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email Address" 
                        className="input" // Using the global input class
                        disabled={isLoading}
                    />
                    <input 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        type="password" 
                        className="input" // Using the global input class
                        disabled={isLoading}
                    />
                    <button type="submit" className="btn mt-2" disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Authenticating...</span>
                            </div>
                        ) : 'Sign In Securely'}
                    </button>
                </div>
            </form>
        </div>
    </section>
  )
}