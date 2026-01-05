import React from "react";

const Home = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body overflow-x-hidden antialiased transition-colors duration-300">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 glass-nav">
        <div className="relative flex justify-center w-full">
          <div className="px-6 md:px-12 py-4 w-full max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-primary dark:text-dark-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <span className="material-symbols-outlined text-[32px]">
                    local_cafe
                  </span>
                </div>
                <h2 className="text-2xl font-display font-bold tracking-wide text-text-light dark:text-white group-hover:text-primary dark:group-hover:text-dark-accent transition-colors">
                  CafeName
                </h2>
              </div>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-10">
                {["Menu", "About", "Reservations"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm font-medium uppercase tracking-widest text-text-light/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-dark-accent transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-primary dark:bg-dark-accent transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  </a>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4">
                  <a
                    href="#"
                    className="text-sm font-semibold hover:text-primary dark:hover:text-dark-accent transition-colors"
                  >
                    Login
                  </a>
                  <a
                    href="#"
                    className="text-sm font-semibold px-5 py-2 rounded-full bg-primary text-white dark:bg-dark-accent dark:text-black hover:bg-primary-hover dark:hover:bg-teal-400 transition-all shadow-lg shadow-primary/20 dark:shadow-dark-accent/20"
                  >
                    Sign Up
                  </a>
                </div>

                {/* Theme Toggle */}
                <button
                  aria-label="Toggle Theme"
                  className="flex items-center justify-center size-10 rounded-full bg-stone-200/50 dark:bg-white/5 border border-stone-300/20 dark:border-white/10 hover:bg-primary/10 dark:hover:bg-dark-accent/10 text-text-light dark:text-white transition-all transform hover:rotate-12"
                  onClick={() =>
                    document.documentElement.classList.toggle("dark")
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">
                    light_mode
                  </span>
                </button>

                {/* Mobile Menu */}
                <button className="md:hidden flex items-center justify-center size-10 rounded-full bg-stone-200/50 dark:bg-white/5 border border-stone-300/20 dark:border-white/10 hover:bg-primary/10 dark:hover:bg-dark-accent/10 text-text-light dark:text-white transition-all">
                  <span className="material-symbols-outlined">menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-background-light dark:to-background-dark z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/50 via-stone-800/10 to-stone-900/30 z-10" />
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat scale-105 animate-[kenburns_25s_infinite_alternate]"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuChlWdc-vfj1kvnqHitfJF4oNiH4Qcy8A2EXBLzn7MWN7flLdiCKFRrVPHDfg_lVAr-F-ltPFWYKCSc5BjVD-xVO3PAAR88SPNOjgw5vNqw4DVZDXkT3GLYCbKkJ2dv48_TO5G41a9IRXEl13G_KlCBiAmowRx0DLS6bSVhE0-JwZcBaj943dHC9Mw4KMRatKzenLwVn5moro0_vmleJlpFLJ0mzBRHwpvw5sQsLsIWPJSn0mHOZDfieEEgiDlzua_Q8XFQ3cUrTC0")',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center mt-16">
          <div className="glass-panel p-10 md:p-20 rounded-4xl max-w-5xl w-full flex flex-col items-center border-t border-l border-white/30 shadow-2xl backdrop-blur-md">
            <span className="inline-block px-5 py-2 mb-8 text-xs font-bold tracking-[0.25em] text-white uppercase bg-stone-900/20 dark:bg-white/10 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
              Est. 2015 • Premium Roasters
            </span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.05] mb-8 drop-shadow-sm dark:drop-shadow-lg">
              Where great coffee meets{" "}
              <span className="italic text-primary dark:text-dark-accent font-serif">
                great moments
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-text-light/90 dark:text-white/80 font-light leading-relaxed mb-12 max-w-3xl drop-shadow-sm">
              Experience artisanal blends and gourmet pastries in a sanctuary
              designed for you to pause, sip, and savor the finer things.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <button className="flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-primary text-white dark:bg-dark-accent dark:text-black font-bold text-lg hover:bg-primary-hover dark:hover:bg-teal-400 hover:scale-105 transition-all shadow-xl shadow-primary/30 dark:shadow-dark-accent/30">
                <span className="material-symbols-outlined text-[22px]">
                  table_restaurant
                </span>
                Reserve a Table
              </button>

              <button className="flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-white/40 dark:bg-white/10 text-text-light dark:text-white border border-white/50 dark:border-white/30 backdrop-blur-md font-bold text-lg hover:bg-white/60 dark:hover:bg-white/20 transition-all shadow-lg group">
                <span>Explore Menu</span>
                <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-primary/80 dark:text-white/50">
          <span className="material-symbols-outlined text-[32px]">
            keyboard_arrow_down
          </span>
        </div>
      </header>

      {/* ================= OUR PROMISE ================= */}
      <section className="relative py-32 px-6 md:px-12 bg-background-light dark:bg-background-dark overflow-hidden">
        {/* background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 dark:bg-dark-accent/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/30 dark:bg-dark-highlight/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto flex flex-col gap-20 relative z-10">
          {/* heading */}
          <div className="flex flex-col gap-5 text-center items-center">
            <span className="text-primary dark:text-dark-accent font-bold tracking-[0.2em] text-xs uppercase">
              Our Promise
            </span>

            <h2 className="text-4xl md:text-5xl font-display font-medium">
              Why We Are Different
            </h2>

            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary dark:via-dark-accent to-transparent rounded-full my-2" />

            <p className="text-text-light/70 dark:text-text-dark/60 text-lg max-w-2xl font-light">
              Discover the elements that make every visit a memorable experience
              of taste and comfort.
            </p>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              [
                "chair",
                "Cozy Ambience",
                "Relax in our thoughtfully designed space with warm lighting and plush seating.",
              ],
              [
                "spa",
                "Premium Ingredients",
                "Sourced from the best local farms to ensure freshness in every single bite.",
              ],
              [
                "restaurant_menu",
                "Expert Chefs",
                "Signature dishes crafted by culinary masters with a true passion for flavor.",
              ],
              [
                "volunteer_activism",
                "Perfect for Dates",
                "The ideal intimate setting for business meetings and romantic evenings.",
              ],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="glass-card flex flex-col items-center text-center p-8 gap-6 rounded-3xl"
              >
                <div className="size-20 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-primary dark:text-dark-accent shadow-md">
                  <span className="material-symbols-outlined text-[32px]">
                    {icon}
                  </span>
                </div>
                <h3 className="text-xl font-display font-semibold">{title}</h3>
                <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-light leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MENU SECTION ================= */}
      <section className="py-24 px-6 md:px-12 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          {/* header row */}
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-primary/10 dark:border-white/5 pb-8 gap-6">
            <div>
              <span className="text-primary dark:text-dark-accent font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
                Our Menu
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-medium mb-3">
                Our Favorites
              </h2>
              <p className="text-text-light/60 dark:text-text-dark/60 font-light text-lg">
                Hand-picked selections you simply can’t miss.
              </p>
            </div>

            <a className="hidden sm:flex items-center gap-3 px-6 py-2.5 rounded-full border border-primary/20 dark:border-dark-accent/20 text-primary dark:text-dark-accent font-bold hover:bg-primary hover:text-white dark:hover:bg-dark-accent dark:hover:text-black transition-all">
              View Full Menu
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Caramel Macchiato",
                price: "$5.50",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAYWC7AE-nXXIGYiEOPqulo9IQ_gU-ksiZcx5vq-aOkYbhPMp4dI5RfzswMFyqoPtVr6AxfnIkTMALLIYic7084-C70pm7lQs94WK06ywgMoGC2rs0RXNUY8TedTBLlM92e-R3DL_bu9HqauGns_xPqsOj1I8Bth2R0Ke3L2WuteE7R4pU69h34DiAnTPl87LQtNJ9TkzAmwY5kD6c2kUsBPgRsicF2dTYzfUiQHZIdGK1YtaB5KYM6jJuMHrW-VwDwnBpGrmO0Q7k",
              },
              {
                title: "Avocado Toast",
                price: "$12.00",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBNT6aDv58C6S-uYVEKDKsTkqKsBaZHsJfluoM3Q91yPByxB2rus_X652BpL2GW1rCG0RSajcVszdu5kv7LKt19Md8C-ZIjXarOGBkj5LiHtbmmTXQ1QMMdxQ1ts3prmndRPQ0gcL3-7ElpT0JdrLQ7MU4T6ox1W3oBwTF0dNoa7YEO7jYHzUt-9hwcNZ7tPRAczpPDCvyoKbuuIZFd3lAq1RrUMQI5llnOq0oYOpzE9CaiBB4pu91iKtQ_WD5oHG1eBeSV638EEvE",
              },
              {
                title: "Classic Tiramisu",
                price: "$8.00",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBVENcAt5Va0NWXsoGyTyN4QO0euTWESRYDoGu6ziqs0FtjwLc7u_wFPfvi7eKN9ymZYrbyF5dsH7OaRCEk7J6B9IPs3mnsFQONO8KLcml9xwgH0UcnB2tgdWIKJUvIZ_tfBv0NFGGu6GuZcSG7l8rjN6kcFPFGAaFn5P5pTg-qsC1HjbKuhM_ZKwAF-lIwnIOKYGR8-g6dEPgfR-5pd6rSkcOlD_64F7ivvcxuXNX9roxv-s25O47SNWdnGz29HUKZy0Wt4JqOYCE",
              },
            ].map(({ title, price, image }) => (
              <div
                key={title}
                className="group relative rounded-[2rem] overflow-hidden glass-card flex flex-col h-full border-none shadow-soft hover:shadow-warm bg-white dark:bg-[#252525]"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-5 right-5 bg-white/95 dark:bg-background-dark/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-white/20">
                    {price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col gap-4 flex-1 bg-white/40 dark:bg-white/5 backdrop-blur-sm">
                  <h3 className="text-2xl font-display font-bold">{title}</h3>

                  <p className="text-text-light/70 dark:text-text-dark/60 text-sm font-light leading-relaxed">
                    Rich flavors crafted with premium ingredients and perfect
                    balance.
                  </p>

                  <div className="mt-auto pt-6 border-t border-primary/10 dark:border-white/5">
                    <button className="w-full py-3.5 rounded-xl bg-surface-light dark:bg-white/5 font-semibold hover:bg-primary hover:text-white dark:hover:bg-dark-accent dark:hover:text-black transition-all flex items-center justify-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-lg">
                        add_shopping_cart
                      </span>
                      Add to Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* mobile CTA */}
          <div className="sm:hidden flex justify-center">
            <a className="flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold w-full justify-center">
              View Full Menu
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= RESERVATION CTA ================= */}
      <section className="relative py-32 px-6 md:px-12 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/40 dark:bg-background-dark z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-transparent z-10" />
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed blur-[3px]"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWuEBNsDgZdwDCNuXCzWxD1ZWIdxohL4TIlk6twvT71t-9UZCp06b7XMqdSW_Hai_XTwKp77eW-BOhQPgsxd3SCaJgmxRh_wURs5Wiq4TUOGLUPoreQp9EIsncGg2R61uElJM48kYeCsqTOVrWqGLY91gocISY0x151IwiW2j8N0T1Syy_mCagGsBfoYBcUj99QCqVXsfuJKjgDOlPJ3pcF78BNKwG1-EfLygBhrniZjGONfuCCoTEdp9txoVqUm9H3XX9LiuB4BE")',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-white/80 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Book Your Spot
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium text-white leading-tight mb-6">
              Planning a <br />
              <span className="italic text-dark-accent">special visit?</span>
            </h2>
            <p className="text-white/80 text-xl font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Whether it&apos;s a quick coffee catch-up or a long dinner, ensure
              your favorite seat is waiting for you.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="glass-panel p-10 rounded-3xl bg-white/30 dark:bg-black/50 border border-white/40 flex flex-col gap-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-2xl font-display text-white text-center">
                Reserve a Table
              </h3>

              <select className="w-full h-14 rounded-xl bg-white/20 dark:bg-white/5 border border-white/30 text-white px-4">
                <option className="text-black">2 Guests</option>
                <option className="text-black">3 Guests</option>
                <option className="text-black">4 Guests</option>
                <option className="text-black">5+ Guests</option>
              </select>

              <input
                type="date"
                className="w-full h-14 rounded-xl bg-white/20 dark:bg-white/5 border border-white/30 text-white px-4"
              />

              <button className="h-14 rounded-xl bg-white dark:bg-dark-accent text-primary dark:text-black font-bold text-lg hover:bg-surface-light dark:hover:bg-teal-400 transition-all">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-primary/95 dark:bg-[#0d0d0d] text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-display font-bold">CafeName</h2>
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
              © 2023 CafeName. All rights reserved.
            </p>
            <div className="flex gap-8 text-white/50 text-sm">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
