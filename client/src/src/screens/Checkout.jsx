import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useStore } from '../store/store.js'
import { api } from '../lib/api.js'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// CheckoutForm component will be wrapped by <Elements>
function CheckoutFormContent() {
  const { cart, clearCart } = useStore()
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.")
      navigate('/cart')
      return
    }

    const createPaymentIntent = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        const checkoutItems = cart.map(item => ({
          productId: item.product._id, 
          name: item.product.name,
          slug: item.product.slug,
          images: item.product.images,
          variantKey: item.variantKey,
          quantity: item.qty,
          unitPrice: item.product.price,
        }))
        const res = await api.checkout({ items: checkoutItems }, token)
        setClientSecret(res.clientSecret)
        setOrderId(res.orderId)
      } catch (e) {
        toast.error(e.message || 'Failed to initiate checkout.')
        navigate('/cart')
      } finally {
        setIsLoading(false)
      }
    }
    createPaymentIntent()
  }, [cart, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return
    }

    setIsLoading(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/orders/${orderId}`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        // Optionally, call backend to update order status to failed
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const token = localStorage.getItem('token')
        await api.confirmPayment(orderId, paymentIntent.id, token)
        clearCart()
        toast.success('Payment successful and order placed!')
        navigate(`/orders/${orderId}`)
      } else if (paymentIntent) {
        // Handle other paymentIntent statuses if necessary
        toast.error(`Payment failed: ${paymentIntent.status}`)
        const token = localStorage.getItem('token')
        await api.confirmPayment(orderId, paymentIntent.id, token) // Update backend status
      }

    } catch (e) {
      toast.error(e.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl grid gap-0 overflow-hidden rounded-3xl shadow-2xl shadow-gray-300/50 lg:grid-cols-2">
        
        {/* Left: Pricing Plan (dark) with Illustration */}
        <div className="relative flex flex-col justify-between bg-emerald-900 p-8 lg:p-12 text-white overflow-hidden">
          
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_left_-200px,rgba(255,255,255,0.12),transparent)]"></div>

          <div className="relative z-10">
            {/* Header/Back Link */}
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Link to="/cart" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10 cursor-pointer">
                &#8592;
              </Link>
              <span>Secure Checkout</span>
            </div>

            {/* Total Display */}
            <div className="mt-8">
              <div className="text-sm opacity-70 font-medium">Total due today</div>
              <div className="text-6xl font-extrabold tracking-tight mt-1">
                US${' '}
                <span className="text-emerald-300">
                  {total > 0 ? total.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-8 space-y-3">
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-80">Cart Subtotal</div>
                    <div className="text-lg font-semibold">${total.toFixed(2)}</div>
                  </div>
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-600/30 text-emerald-300">
                    {cart.length} Items
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-transparent p-4 ring-1 ring-white/10 opacity-70">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Taxes and Fees</div>
                  <div className="text-lg font-semibold">US$ 0.00</div>
                </div>
              </div>
              <div className="rounded-xl bg-transparent p-4 ring-1 ring-white/10 opacity-70">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Promocode Applied</div>
                  <div className="text-lg font-semibold">—</div>
                </div>
              </div>
            </div>
          </div>

          {/* New: Professional Illustration */}
          <div className="relative z-10 mt-12 mb-4 flex justify-center">
            <img 
                src="https://placehold.co/300x200/10B981/ffffff?text=SECURE+PAYMENT" 
                alt="Secure payment illustration" 
                className="w-3/4 max-w-xs h-auto opacity-90 rounded-xl shadow-2xl"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/10B981/ffffff?text=SECURE+PAYMENT" }}
            />
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-6 flex items-center justify-between text-xs opacity-70 border-t border-white/10 pt-4">
            <span>©2025 Dolens. All rights reserved</span>
            <div className="space-x-4">
                <a className="underline hover:text-white" href="#">Terms</a>
                <a className="underline hover:text-white" href="#">Privacy</a>
            </div>
          </div>
        </div>

        {/* Right: Pay With Card Form (light) */}
        <div className="bg-white p-8 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your card details to complete your order.</p>

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              {clientSecret && (
                <PaymentElement />
              )}
              <button 
                type="submit" 
                className="btn w-full text-lg font-bold py-3 mt-4" 
                disabled={!stripe || !elements || isLoading || total === 0}
              >
                {isLoading ? 'Processing...' : (total > 0 ? `Pay US$ ${total.toFixed(2)}` : 'Cart is Empty')}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Secured by Stripe.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent />
    </Elements>
  )
}
