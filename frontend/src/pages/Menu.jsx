import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus } from "../store/slices/menuSlice";

export default function Menu() {
  const dispatch = useDispatch();
  const { items: menus, categories, loading, error, lastFetched } = useSelector(state => state.menu);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Only fetch if no data or data is older than 5 minutes
    const shouldFetch = !menus.length || !lastFetched || (Date.now() - lastFetched) > 300000;
    if (shouldFetch) {
      console.log('🔄 Fetching menu data from API...');
      dispatch(fetchMenus());
    } else {
      console.log('📦 Using cached menu data from Redux state');
    }
  }, [dispatch, menus.length, lastFetched]);

  const filteredMenus = selectedCategory === 'all'
    ? menus.filter(item => item.isAvailable)
    : menus.filter(item => item.category === selectedCategory && item.isAvailable);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-background-light dark:bg-background-dark">
        {/* Light mode background */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#E6DCCF] rounded-full blur-[120px] opacity-40 z-10 block dark:hidden mix-blend-multiply"></div>

        {/* Grain texture */}
        <div
          className="absolute inset-0 z-20 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C9286' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      {/* Main content */}
      <main className="relative z-20 min-h-screen flex flex-col pt-18">
        {/* Hero section */}
        <section className="relative px-6 py-12 md:py-20 text-center">
          <div className="mx-auto max-w-4xl relative">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 text-xs font-bold text-primary dark:text-white uppercase tracking-[0.2em] backdrop-blur-md">
              Seasonal Flavors
            </span>
            
          </div>
        </section>

        {/* MENU SECTION */}
        <section className="relative px-6">
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-text-light dark:text-white mb-4">
                Our <span className="text-primary italic">Menu</span>
              </h2>
              <p className="text-base text-text-light/70 dark:text-text-dark/60 max-w-xl mx-auto font-light">
                Discover our carefully curated selection of premium dishes and beverages.
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => handleCategoryFilter('all')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'glass-card hover:border-primary dark:hover:border-dark-accent text-text-light dark:text-white hover:text-primary dark:hover:text-dark-accent'
                }`}
              >
                <span className="text-xs font-medium">All Items</span>
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'glass-card hover:border-primary dark:hover:border-dark-accent text-text-light dark:text-white hover:text-primary dark:hover:text-dark-accent'
                  }`}
                >
                  <span className="text-xs font-medium capitalize">{category}</span>
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-light/70 dark:text-text-dark/60 text-lg">No items available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMenus.map((item, index) => (
                  <div
                    key={item._id}
                    className="group relative overflow-hidden rounded-2xl glass-card hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-dark-accent/10 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-4xl text-primary/40">{item.name.charAt(0)}</span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                      {/* Price Badge */}
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-2 py-1 rounded-full">
                        <span className="text-xs font-bold text-text-light dark:text-white">${item.price}</span>
                      </div>

                      {/* Veg/Non-Veg Indicator */}
                      <div className="absolute top-3 left-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-lg font-medium text-text-light dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-text-light/70 dark:text-text-dark/60 text-xs leading-relaxed mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wide text-primary">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-text-light/50 dark:text-text-dark/50">
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-200 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RESERVATION SECTION */}
        <section className="relative px-6 pb-20 mt-10">
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

      {/* ================= FOOTER ================= */}
      <footer className="bg-primary/95 dark:bg-[#0d0d0d] text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-display font-bold">Lumiere.</h2>
              <p className="text-white/80 text-sm leading-relaxed font-light">
                Crafting memorable experiences through exceptional coffee,
                artisanal food, and a warm atmosphere since 2015.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl mb-4">Explore</h3>
              <ul className="space-y-3 text-white/80 text-sm">
                <li>Our Story</li>
                <li>Full Menu</li>
                <li>Private Events</li>
                <li>Gift Cards</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl mb-4">Visit Us</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                123 Coffee Street <br />
                Brewtown, BT 90210
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl mb-4">
                Opening Hours
              </h3>
              <p className="text-white/80 text-sm">
                Mon – Fri: 7am – 9pm <br />
                Sat: 8am – 10pm <br />
                Sun: 8am – 8pm
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/50 text-sm">
              © 2024 Lumiere Cafe. All rights reserved.
            </p>
            <div className="flex gap-8 text-white/50 text-sm">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
