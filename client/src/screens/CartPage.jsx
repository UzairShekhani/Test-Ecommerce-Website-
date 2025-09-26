import { Link } from 'react-router-dom'
import { useStore } from '../store/store.js'
import { toast } from 'sonner'

// Quantity Selector Component
const QuantitySelector = ({ item, updateQty }) => {
  const handleUpdate = (newQty) => {
    const finalQty = Math.max(1, newQty)
    updateQty(item.key, finalQty)
    toast.success('Quantity updated')
  }

  return (
    <div className="flex items-center space-x-2 border rounded-lg text-gray-700">
      <button
        className="p-2 w-8 h-8 flex items-center justify-center text-xl font-light hover:bg-gray-100 rounded-l-lg transition"
        onClick={() => handleUpdate(item.qty - 1)}
        disabled={item.qty <= 1}
      >
        -
      </button>
      <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
      <button
        className="p-2 w-8 h-8 flex items-center justify-center text-xl font-light hover:bg-gray-100 rounded-r-lg transition"
        onClick={() => handleUpdate(item.qty + 1)}
      >
        +
      </button>
    </div>
  )
}

// Remove button
const RemoveButton = ({ itemKey, removeFromCart }) => (
  <button
    className="text-gray-400 hover:text-red-600 transition duration-200"
    onClick={() => {
      removeFromCart(itemKey)
      toast.success('Item removed from cart')
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
        clipRule="evenodd"
      />
    </svg>
  </button>
)

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useStore()
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const isCartEmpty = cart.length === 0

  const taxRate = 0.05
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  return (
    <section className="container mx-auto px-4 py-12 grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Cart Items */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 p-6 font-semibold text-2xl text-gray-800">
          Shopping Cart ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
        </div>

        <div className="divide-y divide-gray-100">
          {isCartEmpty ? (
            <div className="p-12 text-center text-gray-500 text-lg">
              <p className="mb-4">😔 Your cart is empty.</p>
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                Start shopping now!
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.key}
                className="flex items-start gap-6 p-6 transition hover:bg-gray-50"
              >
                {/* Product Image */}
                <Link to={`/products/${item.product.id}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover border border-gray-100 shadow-sm"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-semibold text-lg text-gray-900 hover:text-indigo-600 transition"
                    >
                      {item.product.name}
                    </Link>
                    <RemoveButton
                      itemKey={item.key}
                      removeFromCart={removeFromCart}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.variantKey}
                  </div>
                  <div className="mt-2 text-xl font-bold text-gray-800">
                    ${(item.product.price * item.qty).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    (${item.product.price.toFixed(2)} each)
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col items-end pt-1">
                  <QuantitySelector item={item} updateQty={updateQty} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Summary */}
      <aside className="rounded-xl border border-gray-200 bg-white p-6 h-fit sticky top-24 shadow-xl">
        <div className="font-semibold text-2xl mb-4 border-b pb-3 text-gray-800">
          Order Summary
        </div>

        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between text-base">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Shipping</span>
            <span className="font-medium text-green-600">FREE</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-dashed border-gray-300 pt-4 flex justify-between font-extrabold text-2xl text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Link
          to={isCartEmpty ? '#' : '/checkout'}
          className={`mt-6 w-full block text-center py-3 rounded-lg font-bold transition ${
            isCartEmpty
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
          }`}
          onClick={(e) => {
            if (isCartEmpty) e.preventDefault()
          }}
        >
          {isCartEmpty ? 'Cart is Empty' : 'Proceed to Checkout'}
        </Link>

        <p className="mt-3 text-center text-sm text-gray-500">
          Secure payment via Stripe / PayPal
        </p>
      </aside>
    </section>
  )
}
