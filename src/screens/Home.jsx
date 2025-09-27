export default function Home() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left: Content */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-snug">
              Discover <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Timeless</span> Pieces
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed">
              Curated products with elegant design. Find the perfect addition to your style and home.
            </p>
            <div className="mt-10 flex gap-4">
              <a
                href="/products"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Right: Premium Image Card */}
          <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-700 ease-out">
            <img
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&auto=format&fit=crop&q=70"
              alt="hero luxury watch and leather goods"
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Glassmorphism footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-white/10 border-t border-white/20">
              <span className="text-2xl font-bold tracking-wide text-white drop-shadow">
                New Arrivals
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
