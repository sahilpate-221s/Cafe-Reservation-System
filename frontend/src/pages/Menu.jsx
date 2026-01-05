import React from "react";

export default function Menu() {
  return (
    <>
      {/* Glow blobs for background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-blob w-96 h-96 top-0 left-[-100px] opacity-60 animate-pulse"></div>
        <div className="glow-blob w-[600px] h-[600px] bottom-[-100px] right-[-200px] opacity-40"></div>
        <div className="glow-blob w-64 h-64 top-1/3 left-2/3 opacity-30"></div>
      </div>

      {/* Header section with navigation */}
      <header className="fixed top-0 z-50 w-full glass-nav transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary-10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                Lumiere.
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              <a
                className="text-sm font-medium opacity-80 hover:opacity-100 hover:text-primary transition-all"
                href="#"
              >
                Home
              </a>
              <a
                className="text-sm font-bold text-primary relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary"
                href="#"
              >
                Menu
              </a>
              <a
                className="text-sm font-medium opacity-80 hover:opacity-100 hover:text-primary transition-all"
                href="#"
              >
                About
              </a>
              <a
                className="text-sm font-medium opacity-80 hover:opacity-100 hover:text-primary transition-all"
                href="#"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 rounded-full bg-primary-10 px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 border border-primary-20">
                Book Table
              </button>

              <button
                className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
                onClick={() =>
                  document.documentElement.classList.toggle("dark")
                }
              >
                <span className="material-symbols-outlined dark:hidden">
                  dark_mode
                </span>
                <span className="material-symbols-outlined hidden dark:block">
                  light_mode
                </span>
              </button>

              <button className="md:hidden p-2 hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-full transition-colors opacity-70">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-12">
        {/* Hero section */}
        <section className="relative px-6 py-12 md:py-20 text-center">
          <div className="mx-auto max-w-4xl relative">
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary-10 border border-primary-20 text-xs font-bold text-primary uppercase tracking-[0.2em] backdrop-blur-md">
              Seasonal Flavors
            </span>

            <h2 className="mb-8 font-serif text-5xl font-medium tracking-tight md:text-7xl leading-[1.1]">
              Curated for your <br className="hidden md:block" />
              <span className="italic text-primary">exquisite</span> taste.
            </h2>

            <p className="mb-12 text-lg md:text-xl opacity-70 max-w-2xl mx-auto font-light leading-relaxed">
              A culinary journey through textures and aromas. From robust
              coffees to delicate desserts, experience our passion in every
              bite.
            </p>

            <div className="flex flex-wrap justify-center gap-3 p-2">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-sm font-bold tracking-wide">
                  All Items
                </span>
              </button>

              <button className="flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5 bg-transparent border border-gray-200 dark:border-white/10">
                <span className="material-symbols-outlined text-[18px]">
                  coffee
                </span>
                <span className="text-sm font-medium">Coffee</span>
              </button>

              <button className="flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5 bg-transparent border border-gray-200 dark:border-white/10">
                <span className="material-symbols-outlined text-[18px]">
                  cake
                </span>
                <span className="text-sm font-medium">Desserts</span>
              </button>

              <button className="flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5 bg-transparent border border-gray-200 dark:border-white/10">
                <span className="material-symbols-outlined text-[18px]">
                  cookie
                </span>
                <span className="text-sm font-medium">Snacks</span>
              </button>

              <button className="flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5 bg-transparent border border-gray-200 dark:border-white/10">
                <span className="material-symbols-outlined text-[18px]">
                  restaurant_menu
                </span>
                <span className="text-sm font-medium">Main Course</span>
              </button>
            </div>
          </div>
        </section>

        {/* Menu grid and reservation CTA section */}
        {/* Note: The original code had a comment about this section being long and unchanged.
            Since the full content wasn't provided, this placeholder remains. */}
        {/* RESERVATION SECTION */}
        <section className="relative px-6 pb-20">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[3rem] relative group border border-gray-200 dark:border-white/5 shadow-2xl">
            {/* Background */}
            <div className="absolute inset-0 bg-black">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBICcObeHJIT8Qp4j6Ztr8WKRk5UYHkcN4TzG1GcuWVdLKKV-gj-IO59g2JSje5M4Hm9-KTSavd7p5jC35JtfbC2KP8pLAJKZpYrhpTPJF6WT01eszsbaSZiErCRfqX-cX9MsyIJJGp5nwhja8X0YSy6CbwDeCJtuokH9cqWaHorfSqXMAzgjgIFROAoHibkTvIWqVBLd_nqD8IPte13Ft6S8wqIRCOV6uiuM2bXf4fANq7bq5ZRHDiOShMRgamxsR5L61GHm-pZiY"
                alt="Restaurant interior atmosphere"
                className="h-full w-full object-cover opacity-50 transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-start justify-center gap-8 px-8 py-20 md:px-20 md:py-32 text-left">
              <div className="flex flex-col gap-5 max-w-2xl">
                <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <span className="w-12 h-px bg-primary"></span>
                  Reservations
                </span>

                <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-white md:text-6xl">
                  A Table for Every <br />
                  <span className="text-primary italic">Occasion</span>
                </h2>

                <p className="text-lg text-gray-300 font-light leading-relaxed max-w-lg">
                  Immerse yourself in our ambiance. Whether it's a casual coffee
                  date or a full course dinner, we have a cozy spot waiting just
                  for you.
                </p>
              </div>

              <button className="group flex items-center gap-4 rounded-full bg-primary px-8 py-4 text-base font-bold text-white hover:bg-white hover:text-primary transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-white/20">
                Book a Table
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer section */}
      <footer className="border-t border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/30 backdrop-blur-sm pt-16 pb-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-10 text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    restaurant
                  </span>
                </div>
                <span className="font-serif text-2xl font-bold">Lumiere.</span>
              </div>
              <p className="text-sm opacity-60 max-w-xs text-center md:text-left leading-relaxed">
                A sanctuary for coffee lovers and food enthusiasts. Experience
                the art of dining.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm font-bold tracking-wide opacity-80">
              <a className="hover:text-primary transition-colors" href="#">
                Home
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Menu
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Our Story
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Locations
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Careers
              </a>
            </div>

            <div className="flex gap-4">{/* SVG icons unchanged */}</div>
          </div>

          <div className="border-t border-gray-200 dark:border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
            <p>© 2024 Lumiere Cafe. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
