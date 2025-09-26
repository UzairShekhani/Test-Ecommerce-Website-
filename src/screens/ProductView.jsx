import { useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useStore } from '../store/store.js'
import { toast } from 'sonner'
import { api } from '../lib/api.js'

export default function ProductView() {
  const { slug } = useParams()
  const products = useStore((s) => s.products)
  const addToCart = useStore((s) => s.addToCart)
  const user = useStore((s) => s.user)
  const favorites = useStore((s) => s.favorites)
  const addFavoriteStore = useStore((s) => s.addFavorite)
  const removeFavoriteStore = useStore((s) => s.removeFavorite)

  const product = useMemo(()=>products.find((p)=>p.slug===slug),[products, slug])
  const [size, setSize] = useState(product?.size || 'md')
  const [colour, setColour] = useState(product?.colour || 'black')

  // Check if product is already favorited
  const isFavorited = useMemo(() => favorites.some(fav => fav._id === product?._id), [favorites, product])

  if (!product) return <div className="container py-12">Not found.</div>

  const variantKey = `size:${size}|colour:${colour}`

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please log in to manage favorites.')
      return
    }
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Authentication token missing. Please log in.')
      return
    }

    try {
      if (isFavorited) {
        await api.removeFavorite(product._id, token)
        removeFavoriteStore(product._id)
        toast.success('Removed from favorites!')
      } else {
        const res = await api.addFavorite(product._id, token)
        addFavoriteStore(res) // Add the full product object returned by API
        toast.success('Added to favorites!')
      }
    } catch (e) {
      toast.error(e.message || 'Failed to update favorites.')
    }
  }

  return (
    <section className="container py-8 grid gap-8 md:grid-cols-2">
      <img src={product.images[0]} alt={product.name} className="aspect-square w-full rounded-xl object-cover" />
      <div>
        <div className="text-sm text-gray-600">{product.tags.join(', ')}</div>
        <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>
        <div className="mt-2 text-xl">${product.price}</div>
        <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm mb-1 text-gray-600">Size</div>
            <select className="input" value={size} onChange={(e)=>setSize(e.target.value)}>
              {['sm','md','lg','xl'].map((s)=>(<option key={s} value={s}>{s.toUpperCase()}</option>))}
            </select>
          </div>
          <div>
            <div className="text-sm mb-1 text-gray-600">Colour</div>
            <select className="input" value={colour} onChange={(e)=>setColour(e.target.value)}>
              {['black','white','gold','rose'].map((c)=>(<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="btn" onClick={()=>{addToCart(product, variantKey); toast.success('Added to cart')}}>Add to cart</button>
          <button className="btn-outline flex items-center justify-center gap-2" onClick={handleFavoriteToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            {isFavorited ? 'Favorited' : 'Add to favorites'}
          </button>
        </div>
      </div>
    </section>
  )
}