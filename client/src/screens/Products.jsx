import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/store.js'
import { api } from '../lib/api.js'
import { toast } from 'sonner'

// Product Card Component
const ProductCard = ({ product }) => (
  <Link
    key={product._id}
    to={`/product/${product.slug}`}
    className="block bg-white rounded-xl overflow-hidden shadow-md transition duration-300 hover:shadow-xl hover:scale-[1.02] transform"
  >
    <div className="aspect-square w-full overflow-hidden">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="h-full w-full object-cover transition duration-300 hover:opacity-90"
      />
    </div>
    <div className="p-4">
      <div className="text-xs uppercase tracking-wider font-semibold text-indigo-600">{product.tags?.[0]}</div>
      <div className="mt-1 text-lg font-bold text-gray-900 truncate">{product.name}</div>
      <div className="mt-1 text-xl font-semibold text-gray-800">${product.price.toFixed(2)}</div>
    </div>
  </Link>
)

export default function Products() {
  const productsState = useStore((s) => s.products)
  const setProducts = (items) => useStore.setState({ products: items })

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('popular')
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [page, setPage] = useState(1)

  // ✅ New: price range
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Fetch products from backend
  useEffect(() => {
    api.products({ sort, category, tag })
      .then((d) => setProducts(d.items))
      .catch((e) => toast.error(e.message))
  }, [sort, category, tag])

  const products = productsState

  // Client-side filters (search + price range)
  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.name?.toLowerCase().includes(query.toLowerCase())
    )

    // ✅ Apply price range filter
    if (minPrice) list = list.filter((p) => p.price >= Number(minPrice))
    if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice))

    return list
  }, [products, query, minPrice, maxPrice])

  // Pagination
  const perPage = 12
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">All Products</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Filters */}
        <aside className="md:w-64 space-y-6 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-20">
            <h2 className="font-bold text-xl mb-4 border-b pb-2">Filter & Sort</h2>

            {/* Search */}
            <div>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                id="search-input"
                className="input"
                placeholder="Search products..."
                value={query}
                onChange={(e) => { setPage(1); setQuery(e.target.value) }}
              />
            </div>

            {/* Sort */}
            <div className="mt-5">
              <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                id="sort-select"
                className="input"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1) }}
              >
                <option value="popular">Popularity (Best Seller)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Category */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="input"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1) }}
              >
                <option value="">All</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            {/* Tag */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <select
                className="input"
                value={tag}
                onChange={(e) => { setTag(e.target.value); setPage(1) }}
              >
                <option value="">All</option>
                <option value="new">New</option>
                <option value="trending">Trending</option>
                <option value="discount">Discount</option>
              </select>
            </div>

            {/* ✅ Price Range */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1) }}
                  className="input w-1/2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
                  className="input w-1/2"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {pageItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {pageItems.map((p) => (<ProductCard key={p._id} product={p} />))}
            </div>
          ) : (
            <div className="text-center p-10 text-gray-500 text-lg border rounded-xl bg-white">
              No products found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                className="btn-outline px-4 py-2"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </button>
              <span className="text-base font-medium text-gray-700">Page {page} of {totalPages}</span>
              <button
                className="btn-outline px-4 py-2"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
