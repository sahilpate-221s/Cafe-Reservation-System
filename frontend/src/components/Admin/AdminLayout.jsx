import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getMe } from '../../services/apiService';

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        if (response.role !== 'ADMIN') {
          navigate('/user-dashboard');
          return;
        }
        setUser(response);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <>
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 bg-background-light dark:bg-background-dark pt-20">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] opacity-40 z-10 block dark:hidden mix-blend-multiply"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-teal/10 rounded-full blur-[120px] opacity-30 z-10 hidden dark:block mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 dark:opacity-30 pointer-events-none"></div>
      </div>

      <main className="flex h-screen relative z-10 pt-20">
        <aside className="flex w-64 flex-col h-full border-r border-stone-200/60 dark:border-white/5 bg-white/60 dark:bg-[#15171a]/80 backdrop-blur-xl relative z-20 shadow-2xl shadow-black/10 dark:shadow-black/50 transform -translate-x-1 rotate-y-1">
          <div className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-primary to-stone-700 dark:to-teal-900 rounded-xl p-2 shadow-lg shadow-primary/20 h-full">
                <span className="material-symbols-outlined text-white text-[24px]">
                  restaurant
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  Brew & Bloom
                </h1>
                <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                  Admin Portal
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="px-3 text-xs font-semibold text-stone-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Main Menu
              </p>

              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin-dashboard')
                    ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                    : 'hover:bg-stone-100 dark:hover:bg-white/5 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive('/admin-dashboard') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}
                  style={isActive('/admin-dashboard') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  dashboard
                </span>
                <span className={`text-sm ${isActive('/admin-dashboard') ? 'font-semibold' : 'font-medium'}`}>Dashboard</span>
              </Link>

              <Link
                to="/admin/manage-tables"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/manage-tables')
                    ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                    : 'hover:bg-stone-100 dark:hover:bg-white/5 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive('/admin/manage-tables') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}
                  style={isActive('/admin/manage-tables') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  table_restaurant
                </span>
                <span className={`text-sm ${isActive('/admin/manage-tables') ? 'font-semibold' : 'font-medium'}`}>Manage Tables</span>
              </Link>

              <Link
                to="/admin/manage-menu"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/manage-menu')
                    ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                    : 'hover:bg-stone-100 dark:hover:bg-white/5 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive('/admin/manage-menu') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}
                  style={isActive('/admin/manage-menu') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  menu_book
                </span>
                <span className={`text-sm ${isActive('/admin/manage-menu') ? 'font-semibold' : 'font-medium'}`}>Manage Menu</span>
              </Link>

              <Link
                to="/admin/all-reservations"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/all-reservations')
                    ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                    : 'hover:bg-stone-100 dark:hover:bg-white/5 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive('/admin/all-reservations') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}
                  style={isActive('/admin/all-reservations') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  calendar_month
                </span>
                <span className={`text-sm ${isActive('/admin/all-reservations') ? 'font-semibold' : 'font-medium'}`}>All Reservations</span>
              </Link>

              <p className="px-3 text-xs font-semibold text-stone-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                System
              </p>

              <Link
                to="/admin/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/settings')
                    ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                    : 'hover:bg-stone-100 dark:hover:bg-white/5 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive('/admin/settings') ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`}
                  style={isActive('/admin/settings') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  settings
                </span>
                <span className={`text-sm ${isActive('/admin/settings') ? 'font-semibold' : 'font-medium'}`}>Settings</span>
              </Link>
            </div>
          </div>

          <div className="px-6 pt-6 pb-0 border-t border-stone-200/60 dark:border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50/50 dark:bg-white/5 border border-stone-200 dark:border-white/5">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center shadow-sm"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC57Xfoo7JzfNS7IXoqruEnyu6cSVCmdGexUBmNBqdpHWgidfe2YjmuGJ04beH0G_tnOxNhRRkbQJViT3PgSKgRI7Yr6-qcackpnOjIO72h3zz4zwRK11la97cYhd_sD6AbeFeSndmZUWJ9l7pZ9R-il0VgtibAjYndM9_C14fKRxaHpyFsdHPjO1QoMTKMJ4ESsHt6NescC6YJHBtyIBiR1hRA1TvnPQlNANGm5Gg7Laic7bOK-TOzZk8gH2kamYzs5qKNOmPgab8')",
                }}
              />
              <div className="flex flex-col overflow-hidden h-full">
                <p className="text-sm font-bold text-stone-800 dark:text-slate-200 truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 truncate">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* 🔥 BACKGROUND BLOBS */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse-slow"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-accent-teal/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 hidden dark:block"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-orange-100/40 dark:bg-primary/5 rounded-full blur-[100px] opacity-40"></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 lg:px-12 lg:py-8 bg-background text-text-main transition-colors duration-300">
          {children}
        </div>
      </main>
    </>
  );
};

export default AdminLayout;
