import { useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useStore } from '../../store/store.js'
import { api } from '../../lib/api.js'

export default function AdminDashboard() {
  const { products, setProducts, addProduct, updateProduct, deleteProduct: deleteProductStore, logout } = useStore()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const formRef = useRef(null)
  
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await api.products()
      setProducts(res.items) // Update zustand store with fetched products
    } catch (e) {
      toast.error('Failed to fetch products: ' + e.message)
    } finally {
      setIsLoading(false)
    }
  }, [setProducts])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleEditClick = useCallback((p) => {
    setEditing(p)
    setName(p.name)
    setPrice(String(p.price))
    setDescription(p.description || '')
    if (formRef.current) formRef.current.querySelector('input[type="file"]').value = ''
  }, [])
  
  const handleCancel = useCallback(() => {
    setEditing(null)
    setName('')
    setPrice('')
    setDescription('')
    if (formRef.current) formRef.current.reset()
  }, [])
  
  const handleDelete = useCallback(async (id, name) => {
    if (!confirm(`Are you sure you want to permanently delete the product: ${name}? This cannot be undone.`)) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await api.deleteProduct(id, token)
      deleteProductStore(id)
      toast.success(`Product \'${name}\' permanently deleted.`) 
    } catch (e) {
      toast.error(e.message || 'Failed to delete product.')
    } finally {
      setIsLoading(false)
    }
  }, [deleteProductStore])

  const onSave = async () => {
    if (!name || !price) {
      toast.error('Product Name and Price are mandatory.')
      return
    }
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const form = new FormData(formRef.current)
      form.set('name', name)
      form.set('price', price)
      form.set('description', description)
      form.set('slug', `${name.toLowerCase().replace(/\s+/g,'-')}-${Date.now()}`)
      
      const res = await api.createProduct(form, token)
      
      addProduct(res)
      toast.success('Product created successfully!')
      
      handleCancel() 
    } catch (e) { 
      toast.error(e.message || 'Failed to create product.') 
    } finally {
      setIsLoading(false)
    }
  }

  const onUpdate = async () => {
    if (!editing || !name || !price) return
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const form = new FormData(formRef.current)
      const fileInput = formRef.current.querySelector('input[name="images"]')
      const newImagesSelected = fileInput && fileInput.files.length > 0
      
      let res
      if (newImagesSelected) {
        form.set('name', name)
        form.set('price', price)
        form.set('description', description)
        res = await api.updateProduct(editing._id, form, token, true) // Use _id from MongoDB
      } else {
        const updateData = { name, price: Number(price), description }
        res = await api.updateProduct(editing._id, updateData, token, false)
      }
      
      updateProduct(editing._id, res) // Update zustand store by _id
      toast.success('Product details updated successfully!')
      
      handleCancel()
    } catch (e) { 
      toast.error(e.message || 'Failed to update product.') 
    } finally {
      setIsLoading(false)
    }
  }
  
  const ProductItem = ({p}) => (
    <div className="grid grid-cols-[50px_1fr_80px_120px] items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-slate-50 transition duration-150">
        <div className="h-10 w-10 rounded-lg bg-gray-200 overflow-hidden shadow-sm flex items-center justify-center border border-gray-100">
            {p.images && p.images[0] ? (
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
            ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.293-1.293a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            )}
        </div>
        <div>
            <div className="font-semibold text-gray-900">{p.name}</div>
            <div className="text-xs text-indigo-500 font-medium truncate">{p.slug}</div>
        </div>
        <div className="font-mono text-base font-semibold text-gray-700">${p.price.toFixed(2)}</div>
        <div className="text-right flex justify-end space-x-2">
            <button 
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition p-2 rounded-lg hover:bg-indigo-100/50" 
                onClick={() => handleEditClick(p)}
                disabled={isLoading}
            >
                Edit
            </button>
            <button 
                className="text-red-600 hover:text-red-800 font-medium text-sm transition p-2 rounded-lg hover:bg-red-100/50" 
                onClick={() => handleDelete(p._id, p.name)} // Use _id for delete
                disabled={isLoading}
            >
                Delete
            </button>
        </div>
    </div>
  )

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="container max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Product List Panel */}
            <div className="rounded-2xl border bg-white overflow-hidden h-fit shadow-lg">
                <div className="flex items-center justify-between border-b-2 border-indigo-100 p-5 bg-indigo-50/20">
                    <div className="text-2xl font-extrabold text-gray-900">
                        Product Inventory <span className="text-indigo-600">({products.length})</span>
                    </div>
                    <button className="btn-outline !w-auto px-4 py-2 text-base" onClick={logout}>
                        Logout
                    </button>
                </div>
                <div className="divide-y divide-gray-100">
                    {isLoading && products.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 text-lg font-medium">Loading products...</div>
                    ) : products.length > 0 ? (
                        products.map((p) => <ProductItem key={p._id} p={p} />)
                    ) : (
                        <div className="p-10 text-center text-gray-500 text-lg font-medium">No products found. Start by adding one!</div>
                    )}
                </div>
            </div>
            
            {/* Product Management Form (Sidebar Panel) */}
            <div className="rounded-2xl border bg-white p-6 h-fit sticky top-10 border-t-4 border-indigo-600 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">
                    {editing ? 'Edit Product Details' : 'Add New Product'}
                </h2>
                
                <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-4">
                        <input 
                            placeholder="Product Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="input" 
                            disabled={isLoading}
                        />
                        <input 
                            placeholder="Price (e.g. 99.99)" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            type="number"
                            step="0.01"
                            name="price"
                            className="input" 
                            disabled={isLoading}
                        />
                        <textarea 
                            className="input h-24 resize-y" // Use global input class and fixed height
                            placeholder="Detailed Description" 
                            rows="4" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            name="description"
                            disabled={isLoading}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                            <select name="size" className="input !bg-gray-50 text-gray-600" disabled={isLoading}>
                                <option value="">Select Size</option><option value="sm">SM</option><option value="md">MD</option><option value="lg">LG</option><option value="xl">XL</option>
                            </select>
                            <select name="colour" className="input !bg-gray-50 text-gray-600" disabled={isLoading}>
                                <option value="">Select Colour</option><option value="black">Black</option><option value="white">White</option><option value="gold">Gold</option><option value="rose">Rose</option>
                            </select>
                        </div>
                        
                        <label className="block text-sm font-semibold text-gray-700 mt-2">Product Images</label>
                        <input name="images" type="file" multiple accept="image/*" className="input p-4 border-dashed border-2 border-indigo-200 bg-indigo-50/50 cursor-pointer" disabled={isLoading} />
                        
                        {editing ? (
                            <div className="flex gap-3 mt-4">
                                <button onClick={onUpdate} className="btn flex-1" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Product'}
                                </button>
                                <button primary={false} onClick={handleCancel} className="btn-outline flex-1" disabled={isLoading}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={onSave} className="btn mt-4" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Product'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    </section>
  )
}