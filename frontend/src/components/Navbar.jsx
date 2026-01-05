import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 glass-nav">
      <div className="relative layout-container flex justify-center w-full">
        <div className="px-6 md:px-12 py-4 w-full max-w-7xl">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-primary dark:text-dark-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "32px" }}
                >
                  local_cafe
                </span>
              </div>
              <h2 className="text-2xl font-display font-bold tracking-wide text-text-light dark:text-white group-hover:text-primary dark:group-hover:text-dark-accent transition-colors">
                CafeName
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <a className="text-sm font-medium uppercase tracking-widest text-text-light/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-dark-accent transition-colors relative group" href="#">
                Menu
                <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-primary dark:bg-dark-accent transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>

              <a className="text-sm font-medium uppercase tracking-widest text-text-light/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-dark-accent transition-colors relative group" href="#">
                About
                <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-primary dark:bg-dark-accent transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>

              <a className="text-sm font-medium uppercase tracking-widest text-text-light/80 dark:text-text-dark/80 hover:text-primary dark:hover:text-dark-accent transition-colors relative group" href="#">
                Reservations
                <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-primary dark:bg-dark-accent transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <a className="text-sm font-semibold hover:text-primary dark:hover:text-dark-accent transition-colors" href="#">
                  Login
                </a>
                <a className="text-sm font-semibold px-5 py-2 rounded-full bg-primary text-white dark:bg-dark-accent dark:text-black hover:bg-primary-hover dark:hover:bg-teal-400 transition-all shadow-lg shadow-primary/20 dark:shadow-dark-accent/20" href="#">
                  Sign Up
                </a>
              </div>

              <button
                aria-label="Toggle Theme"
                onClick={() => document.documentElement.classList.toggle("dark")}
                className="flex items-center justify-center size-10 rounded-full bg-stone-200/50 dark:bg-white/5 border border-stone-300/20 dark:border-white/10 hover:bg-primary/10 dark:hover:bg-dark-accent/10 text-text-light dark:text-white transition-all transform hover:rotate-12"
              >
                <span className="material-symbols-outlined text-[20px]">
                  light_mode
                </span>
              </button>

              <button className="md:hidden flex items-center justify-center size-10 rounded-full bg-stone-200/50 dark:bg-white/5 border border-stone-300/20 dark:border-white/10 hover:bg-primary/10 dark:hover:bg-dark-accent/10 text-text-light dark:text-white transition-all">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
