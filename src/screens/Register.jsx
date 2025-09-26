import { Link, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { api } from '../lib/api.js'
import { toast } from 'sonner'

export default function Register() {
  const navigate = useNavigate()
  const formRef = useRef(null)
  
  const handleRegister = async () => {
    const root = formRef.current
    const username = root.querySelector('#r-username').value
    const email = root.querySelector('#r-email').value
    const phone = root.querySelector('#r-phone').value
    const pass = root.querySelector('#r-pass').value
    const conf = root.querySelector('#r-conf').value
    const file = root.querySelector('#r-avatar').files[0]

    if (!username || !email || !pass || !conf) {
        toast.error('Please fill in all required fields.')
        return
    }
    if (pass !== conf) { 
        toast.error('Passwords do not match'); 
        return 
    }

    const form = new FormData()
    form.set('username', username)
    form.set('email', email)
    form.set('phone', phone)
    form.set('password', pass)
    if (file) form.set('avatar', file)

    try {
      await api.register(form)
      toast.success('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (e) { toast.error(e.message || 'Registration failed. Please try again.') }
  }

  return (
    <section className="container py-10">
      <div className="grid overflow-hidden rounded-2xl shadow-xl  bg-white max-w-4xl mx-auto md:grid-cols-2">
        {/* Left: Form */}
        <div className="p-10 lg:p-12" ref={formRef}>
          <div className="flex items-center gap-2 mb-8">
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-1 text-sm text-gray-500">Join us and start your shopping experience.</p>

          <div className="mt-8 grid gap-5">
            <div>
                <label htmlFor="r-username" className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                <input id="r-username" className="input" placeholder="JohnDoe" required />
            </div>
            <div>
                <label htmlFor="r-email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                <input id="r-email" className="input" placeholder="you@example.com" type="email" required />
            </div>
            <div>
                <label htmlFor="r-phone" className="mb-1 block text-sm font-medium text-gray-700">Phone (Optional)</label>
                <input id="r-phone" className="input" placeholder="e.g., +1 555 123 4567" type="tel" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="r-pass" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                    <input id="r-pass" className="input" placeholder="••••••••" type="password" required />
                </div>
                <div>
                    <label htmlFor="r-conf" className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input id="r-conf" className="input" placeholder="••••••••" type="password" required />
                </div>
            </div>
            <div>
                <label htmlFor="r-avatar" className="mb-1 block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
                <input id="r-avatar" type="file" className="input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>
            
            <button className="btn btn-primary mt-3 py-2.5 font-semibold" onClick={handleRegister}>
              Create Account
            </button>
          </div>

          <p className="mt-8 text-sm text-center text-gray-500">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Sign in</Link>
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="relative hidden md:block bg-indigo-50">
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1400&auto=format&fit=crop&q=60" 
            alt="registration illustration" 
            className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply opacity-70" 
          />
          <div className="absolute inset-0 bg-indigo-600/20" />
        </div>
      </div>
    </section>
  )
}