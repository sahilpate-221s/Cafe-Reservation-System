import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCoffee, FaMoon, FaSun, FaBars, FaUser } from "react-icons/fa";
import { getMe } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getMe()
        .then((response) => {
          setUserRole(response.data.role);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setUserRole(null);
        });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 z-50 w-full py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-full px-6 py-3 shadow-lg flex justify-between items-center">

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary dark:bg-accent-teal text-white flex items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FaCoffee />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
              Brew &amp; Bloom
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { name: "Menu", path: "/menu" },
              { name: "About", path: "/" },
              { name: "Reservations", path: "/reservation" },
              { name: "Events", path: "/events" }
            ].map(({ name, path }) => (
              <div key={name} className="flex flex-col items-center">
                <Link
                  to={path}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-silver transition-colors"
                >
                  {name}
                </Link>
                {location.pathname === path && (
                  <div className="w-1 h-1 bg-primary dark:bg-accent-teal rounded-full mt-1"></div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative dropdown-container cursor-pointer">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary-darker transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 cursor-pointer"
                >
                  <FaUser className="text-sm" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-2xl border border-white/20 dark:border-white/10 z-50 backdrop-blur-md">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        User Profile Dashboard
                      </Link>
                      <Link
                        to={userRole === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard'}
                        className="block px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {userRole === 'ADMIN' ? 'All Reservations' : 'Your Reservations'}
                      </Link>
                      <Link
                        to="/menu"
                        className="block px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all duration-200 rounded-lg mx-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Menu
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 rounded-lg mx-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-silver transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="hidden md:block px-6 py-2.5 rounded-full bg-gray-900 dark:bg-silver text-white dark:text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-gray-700 dark:text-white"
              onClick={toggleTheme}
            >
              <FaMoon className="text-[20px] dark:hidden" />
              <FaSun className="text-[20px] hidden dark:block" />
            </button>

            <button
              type="button"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-white"
            >
              <FaBars />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;




