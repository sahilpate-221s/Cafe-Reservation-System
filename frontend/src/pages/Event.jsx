import React from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const Event = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body overflow-x-hidden antialiased transition-colors duration-300 pt-20">
      {/* ================= HERO ================= */}
      <header className="relative w-full min-h-screen flex items-center justify-center pt-30 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat scale-105 animate-[float_20s_ease-in-out_infinite_alternate]"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJEppRvoYD6easPRYCY9rQtVkHbVsHFYqIDQQ-zeFVt6ngEUYLVx1NGFqS3xz_zJaPrMewxSN4t0n9cNWG-CfLb0QCHNcN3lqyHVzToC_0Ke5jmD26rAic_anGDgp-TKUcsdQQaC4Bf0x-ZB68215BEx8HAxrP5zfH2nbWCVZcfkZgYM6mMPofIJzOuUrd5v2wnXZO5yKWMcJCLto-CTdsINWtKMMooclc_O9kNmEMk4Vaosc7hCeSJTFi-M_trESD2UGqFWuOHe8")',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center justify-center h-full max-w-7xl pb-24">
          <div className="max-w-4xl space-y-8 animate-fade-in-up text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/20 shadow-lg backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary dark:bg-accent-teal animate-pulse"></span>
              <span className="text-gray-900 dark:text-white text-xs font-bold uppercase tracking-widest">
                Coming Soon
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium text-white leading-[1] drop-shadow-2xl">
              Events &amp; <br />
              <span className="italic text-primary dark:text-silver/90">
                Experiences
              </span>
            </h1>

            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-lg font-light tracking-wide border-l-2 border-primary dark:border-accent-teal pl-6">
              Discover upcoming events, workshops, and special experiences at our cafe.
            </p>
          </div>
        </div>
      </header>

      {/* ================= NO EVENTS SECTION ================= */}
      <section className="relative py-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            <div className="glass-panel p-12 rounded-2xl border border-white/20 shadow-2xl max-w-2xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-primary/10 dark:bg-accent-teal/10 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-4xl text-primary dark:text-accent-teal" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">
                    No Events Present Right Now
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md">
                    We're currently planning exciting events and experiences. Check back soon for workshops, live music, and special gatherings!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="text-primary dark:text-accent-teal" />
                    <span>Stay tuned for upcoming dates</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <FaMapMarkerAlt className="text-primary dark:text-accent-teal" />
                    <span>Events at our location</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                Want to Host an Event?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Contact us for private events, corporate gatherings, or special celebrations.
              </p>
              <button className="mt-4 px-8 py-3 bg-primary dark:bg-accent-teal hover:bg-primary/90 dark:hover:bg-accent-teal/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/30 dark:hover:shadow-accent-teal/30 hover:-translate-y-1">
                Get In Touch
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
              <h2 className="text-2xl font-display font-bold">Brew &amp; Bloom</h2>
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
              © 2023 Brew &amp; Bloom. All rights reserved.
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

export default Event;
