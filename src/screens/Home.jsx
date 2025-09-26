export default function Home() {
  return (
    <section className="container py-20 md:py-28 lg:py-36">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left: Content */}
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Discover <span className="text-indigo-600">Timeless</span> Pieces
          </h1>
          <p className="mt-5 text-xl text-gray-600 max-w-lg">
            Curated products with elegant design. Find the perfect addition to your style and home.
          </p>
          <div className="mt-10 flex gap-4">
            <a href="/products" className="btn btn-primary py-3 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]">
              Shop Now
            </a>
          </div>
        </div>
        
        {/* Right: Premium Image Card */}
        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition duration-500">
          <img 
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&auto=format&fit=crop&q=70" 
            alt="hero luxury watch and leather goods" 
            className="h-full w-full object-cover" 
          />
          {/* Subtle gradient overlay for a richer look */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white text-shadow-sm">
            <span className="text-xl font-medium">New Arrivals</span>
          </div>
        </div>
      </div>
    </section>
  )
}