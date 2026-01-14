import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUtensils,
  FaChair,
  FaLeaf,
  FaCoffee,
  FaHeart,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body overflow-x-hidden antialiased transition-colors duration-300 ">
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
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6jYoOKqAgepRH0SgC5UJFqMDr2UcsSxEJoznRpRqjjYLfSNULCvlrSQNgKHH7rfoTf7HMlnTIZ7_FvyAf7P7v-VjF8QHFhT5FfBSJcwrIdIj8yb_xF6TG7a-Wl_EPDVLfbexozq1db-srY-907I9Xz401wfsVtaCfKVyxL8-btgRgK5W6BXc_jQ4JqWD1YRGzWuHcGDEGvLADwtt2oqc5SLvDrqsGez87eIXWP2WO5XTV7JWiePbcM1AxLODctqyWToXIQcH52p4")',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 flex flex-col items-start justify-center h-full max-w-7xl pb-24">
          <div className="max-w-4xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/20 shadow-lg backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary dark:bg-accent-teal animate-pulse"></span>
              <span className="text-gray-900 dark:text-white text-xs font-bold uppercase tracking-widest">
                Now Open for Reservations
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium text-white leading-[1] drop-shadow-2xl">
              Where coffee <br />
              <span className="italic text-primary dark:text-silver/90">
                meets soul.
              </span>
            </h1>

            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-lg font-light tracking-wide border-l-2 border-primary dark:border-accent-teal pl-6">
              Artisanal roasts, chef-crafted pastries, and an atmosphere curated
              for your perfect moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <button className="group relative h-14 px-10 overflow-hidden rounded-full bg-primary dark:bg-accent-teal text-white shadow-xl hover:shadow-primary/40 dark:hover:shadow-accent-teal/40 transition-all hover:-translate-y-1">
                <span className="relative flex items-center gap-3 font-bold tracking-wide z-10">
                  Reserve a Table
                  <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>

              <button className="h-14 px-10 rounded-full glass-panel border border-white/30 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-3 group backdrop-blur-md">
                Explore Menu
                <FaUtensils className="text-lg group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
          {/* Feature cards */}
          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 justify-items-center">
              <div className="glass-panel p-6 rounded-2xl border border-white/20 shadow-2xl hover:-translate-y-2 transition-transform duration-300 group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2.5 bg-primary/20 dark:bg-accent-teal/20 rounded-xl text-primary dark:text-accent-teal-light group-hover:bg-primary group-hover:text-white dark:group-hover:bg-accent-teal dark:group-hover:text-white transition-colors">
                    <FaChair />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white">
                    Cozy Ambience
                  </h3>
                </div>
                <p className="text-xs text-gray-700 dark:text-white font-medium">
                  Warm, inviting spaces for comfort.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/20 shadow-2xl hover:-translate-y-2 transition-transform duration-300 delay-75 group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2.5 bg-primary/20 dark:bg-accent-teal/20 rounded-xl text-primary dark:text-accent-teal-light group-hover:bg-primary group-hover:text-white dark:group-hover:bg-accent-teal dark:group-hover:text-white transition-colors">
                    <FaLeaf />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white">
                    Premium Organic
                  </h3>
                </div>
                <p className="text-xs text-gray-700 dark:text-white font-medium">
                  Finest beans and local produce.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/20 shadow-2xl hover:-translate-y-2 transition-transform duration-300 delay-100 group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2.5 bg-primary/20 dark:bg-accent-teal/20 rounded-xl text-primary dark:text-accent-teal-light group-hover:bg-primary group-hover:text-white dark:group-hover:bg-accent-teal dark:group-hover:text-white transition-colors">
                    <FaCoffee />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white">
                    Master Baristas
                  </h3>
                </div>
                <p className="text-xs text-gray-700 dark:text-white font-medium">
                  Crafting every cup with passion.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/20 shadow-2xl hover:-translate-y-2 transition-transform duration-300 delay-150 group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2.5 bg-primary/20 dark:bg-accent-teal/20 rounded-xl text-primary dark:text-accent-teal-light group-hover:bg-primary group-hover:text-white dark:group-hover:bg-accent-teal dark:group-hover:text-white transition-colors">
                    <FaHeart />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white">
                    Intimate &amp; Calm
                  </h3>
                </div>
                <p className="text-xs text-gray-700 dark:text-white font-medium">
                  Perfect for dates and quiet work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= our signature blend================= */}

      <section className="relative py-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
                Taste the Magic
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white">
                Our Signature Blends
              </h2>
            </div>

            <Link
              to="/menu"
              className="hidden md:inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all group"
            >
              View Full Menu
              <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group relative">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOypVHBOOOus0me6wlwpG1hJhY8gIC1tj_WBHYKhWkRJEa1IEumMxECQk7TCBlCOXw4dcx_SYpLHylHnba8DDK8LQGPEz22y5cFmhGiFwooyr12GEMpa7fB7xbRQrAkGViCYtSt8vWEhWfT-xsyZNdvw_gZaV3jh0kDQWRN04PEdE7nG2N_8_dsEh0jWxv0NfCcVQ_ck-N6Lof6HOJws-amU-3m5KJX40QkWtHlSmEp0MDdqXFCCgtJSPVzW1QnETvowm41S48xRk")',
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="glass-panel p-4 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white text-lg font-serif font-bold">
                        Caramel Macchiato
                      </h3>
                      <span className="text-primary-dark dark:text-primary font-bold bg-white dark:bg-black/50 px-2 py-1 rounded text-xs">
                        $5.50
                      </span>
                    </div>
                    <p className="text-gray-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                      Rich espresso with vanilla and caramel drizzle.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative mt-0 lg:mt-12">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCi7IUpR7rXpks2xcQEMlCITkKASwMt1rDfMCQkriiIVK4iTEp3f1u-M0LMzNi_RXw9aAmh8cJMWiaEoX7f8Fu9WLsOoZOizN4dMg5NOAler59gBu7Pnbkd10jWTgroSym-a-xMZ16Dy3n7RbVckRnO1J1YNg-aA2VWljEckzuPfdHwVx1s21rR1BYEnM4sTwT3I4nZY63GLDVU_ZH_FfbQR6TcpHg4aYhOyFKfrA4e9HQTY5uLMOY9IoiD09SB3T8GALl2aI1xgWA")',
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="glass-panel p-4 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white text-lg font-serif font-bold">
                        Avocado Toast
                      </h3>
                      <span className="text-primary-dark dark:text-primary font-bold bg-white dark:bg-black/50 px-2 py-1 rounded text-xs">
                        $8.00
                      </span>
                    </div>
                    <p className="text-gray-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                      Sourdough bread topped with fresh avocado &amp; seeds.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD46P_yyQb5iY5o1dNuosviaxoOKWRsboOhS1XXh1HRK0z7e1dGjnA7_IlLg4y3T43-UKhRyL-aKL96BIO7tJsgufgHS_z8Cd-lngkkICYYM7YtVPYUNbG1DzZGaHo-rwuHW8VCauIXeMiKo9Q7jLRz_FvqDe3f_njdkE-y1c87top5qo17fl7BxHrVpv2YeXjlwJ4YuEtNCC_N4Rc-TZGQSyt_Toh-uhG_2vF-23f-3jVJJPQzkO11qjPh_cClkPT9OGC74bt6Zdk")',
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="glass-panel p-4 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white text-lg font-serif font-bold">
                        Berry Smoothie
                      </h3>
                      <span className="text-primary-dark dark:text-primary font-bold bg-white dark:bg-black/50 px-2 py-1 rounded text-xs">
                        $6.50
                      </span>
                    </div>
                    <p className="text-gray-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                      Fresh blend of strawberries, blueberries and yogurt.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative mt-0 lg:mt-12">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzm6sUbLKAhIIx3gQe15wiNUF8vnayVQA3fSZcsipQhzdiZyk0M4G7dCxf93YSZHc248vpGgwf--3nQ0lpF5Y_wXxLPs5dyb0eTnua_l4dJQq0ZnXLROCyWs225wj69KTDQUxQFxGRnsebCTAZwaCIqDuwl4Q0jE4-nsxiCSo29yLggQ1dyvALa2p1ckMBzjqvdc6pnH6V6reWN4IcELPOVQZhZiQUd6wSZW79GN6BE7ilDp-WEscN0mNsIIW22UO0nez1onjmAPc")',
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="glass-panel p-4 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white text-lg font-serif font-bold">
                        Butter Croissant
                      </h3>
                      <span className="text-primary-dark dark:text-primary font-bold bg-white dark:bg-black/50 px-2 py-1 rounded text-xs">
                        $3.50
                      </span>
                    </div>
                    <p className="text-gray-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                      Buttery, flaky, and freshly baked daily by our chefs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 md:hidden flex justify-center">
            <Link
              to="/menu"
              className="w-full py-4 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ================= RESERVATION CTA ================= */}
      <section className="py-20 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-surface-dark shadow-2xl min-h-[500px] grid grid-cols-1 md:grid-cols-2">
            {/* LEFT CONTENT */}
            <div className="relative z-10 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-r from-background-dark via-background-dark/95 to-background-dark/80">
              <div className="mb-6 flex items-center gap-3">
                <span className="w-10 h-[1px] bg-primary"></span>
                <span className="text-primary uppercase tracking-widest text-xs font-bold">
                  Book a Table
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6 leading-tight">
                Secure the best spot for your{" "}
                <span className="text-primary italic">evening</span>
              </h2>

              <p className="text-gray-400 text-base mb-10 max-w-md font-light leading-relaxed">
                Avoid the wait. Whether it's a romantic dinner or a business
                meeting, we have the perfect table for you.
              </p>

              <form className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-2 gap-5">
                  <div className="group relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                      calendar_today
                    </span>
                    <input
                      type="date"
                      placeholder="Date"
                      className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white/10"
                      style={{ color: 'white' }}
                    />
                  </div>

                  <div className="group relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                      schedule
                    </span>
                    <input
                      type="time"
                      placeholder="Time"
                      className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white/10"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                    group
                  </span>

                  <input
                    type="text"
                    placeholder="Number of Guests"
                    className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white/10"
                  />
                </div>

                <button
                  type="button"
                  className="mt-4 h-14 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                >
                  Check Availability
                </button>
              </form>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative h-full min-h-[300px] md:min-h-auto">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-[2000ms]"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBWohu6gQ_LTu4RvB2A3tGGhEaS_2F4EP6TgH4qKvDsePOaiCCrtzZx-6gu2f7L8TYGGlIVZljcW8HN7OGyFoVgBeMx3TZrR3I4upSStPxgUTCr8CJPhdG1l2iWo1AV6K3SWA3HH5ApUDQKfOUKjWUCWNO5K5nHiRvKXeZJiqSDQmnbKUa1450U9cRURTAl-ikm1C1t5S8RjNTgsKz9GXEEYFwjwV506jKZelCWkDdPKPzCvhaZnLb1qZPxmIjf91k20vxW_BWbys")',
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-l from-background-dark to-transparent md:block hidden"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent md:hidden block"></div>

              <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-full w-24 h-24 flex flex-col items-center justify-center rotate-12 shadow-2xl animate-float">
                <span className="text-2xl font-bold font-serif">20%</span>
                <span className="text-[10px] uppercase tracking-wide text-center">
                  Off First Booking
                </span>
              </div>
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
