import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCoffee, FaMoon, FaSun, FaBars, FaUser } from "react-icons/fa";
import { getMe } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  /* =========================
     CLICK OUTSIDE DROPDOWN
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     AUTH STATE SYNC
  ========================= */
  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  /* =========================
     FETCH USER ROLE
  ========================= */
  useEffect(() => {
    if (!isLoggedIn) {
      setUserRole(null);
      return;
    }

    getMe()
      .then((user) => {
        setUserRole(user.role);
      })
      .catch(() => {
        // Token invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserRole(null);
      });
  }, [isLoggedIn]);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 z-50 w-full py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-full px-6 py-3 shadow-lg flex justify-between items-center">

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary dark:bg-accent-teal text-white flex items-center justify-center rounded-full shadow-lg">
              <FaCoffee />
            </div>
            <span className="text-xl font-serif font-bold">
              Brew &amp; Bloom
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { name: "Menu", path: "/menu" },
              { name: "About", path: "/" },
              { name: "Reservations", path: "/reservation" },
              { name: "Events", path: "/events" },
            ].map(({ name, path }) => (
              <Link key={name} to={path} className="text-sm font-medium">
                {name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center"
                >
                  <FaUser />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-xl z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      to={
                        userRole === "ADMIN"
                          ? "/admin-dashboard"
                          : "/user-dashboard"
                      }
                      className="block px-4 py-3 text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {userRole === "ADMIN"
                        ? "All Reservations"
                        : "Your Reservations"}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold">
                  Sign Up
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full"
            >
              <FaMoon className="dark:hidden" />
              <FaSun className="hidden dark:block" />
            </button>

            <button className="md:hidden w-10 h-10 flex items-center justify-center">
              <FaBars />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
