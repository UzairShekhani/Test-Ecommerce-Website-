import { useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useStore } from '../store/store.js'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export default function ProductView() {
  const { slug } = useParams()
  const products = useStore((s) => s.products)
  const addToCart = useStore((s) => s.addToCart)
  // Ensure 'products' data is loaded before trying to find the product
  const product = useMemo(()=>products.find((p)=>p.slug===slug),[products, slug])
  
  // Set initial state based on product data if available
  const [size, setSize] = useState(product?.size || 'md')
  const [colour, setColour] = useState(product?.colour || 'black')

  if (!product) return <div className="container py-16 text-center text-xl text-gray-600">Product not found. <Link to="/products" className="text-indigo-600 hover:underline">Go back to products</Link></div>

  const variantKey = `Size: ${size.toUpperCase()} / Colour: ${colour}`

  return (
    <section className="container py-10 grid gap-10 md:grid-cols-2 bg-white rounded-xl shadow-lg p-8">
      {/* Left: Image Gallery (Assuming first image is the main one) */}
      <div className="md:sticky md:top-20 h-fit">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="aspect-square w-full rounded-2xl object-cover shadow-xl border border-gray-100" 
        />
        {/* You could add a small gallery of other images here */}
      </div>

      {/* Right: Product Details and Actions */}
      <div className="lg:pl-8">
        <div className="text-sm uppercase tracking-wider font-semibold text-indigo-600">
          {product.tags.join(' / ')}
        </div>
        
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900">{product.name}</h1>
        
        <div className="mt-4 text-3xl font-bold text-gray-800">${product.price.toFixed(2)}</div>
        
        {/* Product Description */}
        <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
        
        {/* Variant Selection */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 border-t pt-6">
          <div>
            <div className="text-sm mb-2 font-medium text-gray-700">Select Size</div>
            <select 
                className="input text-lg py-2.5 appearance-none" 
                value={size} 
                onChange={(e)=>setSize(e.target.value)}
            >
              {['sm','md','lg','xl','xxl'].map((s)=>(
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="text-sm mb-2 font-medium text-gray-700">Select Colour</div>
            <select 
                className="input text-lg py-2.5 appearance-none" 
                value={colour} 
                onChange={(e)=>setColour(e.target.value)}
            >
              {['black','white','gold','rose','blue','grey'].map((c)=>(
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Variant Summary */}
        <div className="mt-6 text-sm text-gray-600">
            Selected: <span className="font-semibold text-gray-800">{variantKey}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button 
            className="btn btn-primary flex-1 py-3 text-lg font-bold shadow-md hover:shadow-lg" 
            onClick={()=>{
              addToCart(product, variantKey)
              toast.success(`${product.name} added to cart!`)
            }}
          >
            Add to Cart
          </button>
          <button className="btn-outline flex-1 py-3 text-lg font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            Add to Favorites
          </button>
        </div>
      </div>
    </section>
  )
}