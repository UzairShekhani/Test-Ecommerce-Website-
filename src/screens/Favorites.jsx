import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../store/store.js'
import { api } from '../lib/api.js'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const user = useStore((s) => s.user)
  const favorites = useStore((s) => s.favorites)
  const setFavorites = (favs) => useStore.setState({ favorites: favs })
  const removeFavoriteStore = useStore((s) => s.removeFavorite)

  const [isLoading, setIsLoading] = useState(false)

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]) // Clear favorites if not logged in
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication token missing.')
      const res = await api.getFavorites(token)
      setFavorites(res) // Update zustand store
    } catch (e) {
      toast.error(e.message || 'Failed to fetch favorites.')
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }, [user, setFavorites])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const handleRemoveFavorite = async (productId, productName) => {
    if (!confirm(`Are you sure you want to remove \'${productName}\' from favorites?`)) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await api.removeFavorite(productId, token)
      removeFavoriteStore(productId)
      toast.success(`\'${productName}\' removed from favorites.`) 
    } catch (e) {
      toast.error(e.message || 'Failed to remove from favorites.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <section className="container py-12 text-center">
        <h1 className="text-3xl font-semibold">Favorites Page</h1>
        <p className="mt-4 text-gray-600">Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to view your favorite products.</p>
      </section>
    )
  }

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900">Your Favorites ({favorites.length})</h1>
      
      {isLoading && favorites.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-gray-500 text-lg p-10 border rounded-xl bg-white shadow-sm">
          <p className="mb-4">You haven't added any products to your favorites yet.</p>
          <Link to="/products" className="btn">Start Browsing Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((p) => (
            <div key={p._id} className="card overflow-hidden transition hover:shadow-lg">
              <Link to={`/product/${p.slug}`}>
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="aspect-square w-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </Link>
              <div className="p-4">
                <Link to={`/product/${p.slug}`} className="font-medium text-gray-900 hover:text-indigo-600 transition block mb-1">{p.name}</Link>
                <div className="text-sm text-gray-600">${p.price.toFixed(2)}</div>
                <button 
                  className="mt-3 btn-outline btn-sm w-full" 
                  onClick={() => handleRemoveFavorite(p._id, p.name)}
                  disabled={isLoading}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
