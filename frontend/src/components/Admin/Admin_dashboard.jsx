import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMe, getAllReservations, getTables } from '../../services/api';
import AdminLayout from './AdminLayout';

const DashboardMain = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        if (response.data.role !== 'ADMIN') {
          navigate('/user-dashboard');
          return;
        }
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchReservations();
      fetchTables();
    }
  }, [user]);


  const fetchReservations = async () => {
    setReservationsLoading(true);
    try {
      const response = await getAllReservations();
      // console.log(response);
      setReservations(response.data || response);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setReservationsLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data || response);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  };

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

  const today = new Date().toISOString().split('T')[0];
  const todaysReservations = reservations.filter(res => res.date === today).length;

  return (
    <AdminLayout>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-stone-500 dark:text-slate-400 text-base">
              Welcome back, here's what's happening at Brew & Bloom today.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-stone-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">
                  event_available
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Today
              </span>
            </div>
            <p className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-1">
              {todaysReservations}
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
              Reservations
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-stone-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-teal-500/10 dark:bg-teal-500/20 rounded-xl group-hover:bg-teal-500/20 dark:group-hover:bg-teal-500/30 transition-colors">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-2xl">
                  table_restaurant
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Tables
              </span>
            </div>
            <p className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-1">
              {tables.length}
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
              Active
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-stone-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/30 transition-colors">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">
                  payments
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Revenue
              </span>
            </div>
            <p className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-1">
              --
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-300 font-medium">
              Today's Total
            </p>
          </div>
        </div>

        {/* ALL RESERVATIONS */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-white/50 dark:bg-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
              All Reservations
            </h2>
            <Link
              to="/admin/all-reservations"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>

          {reservationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-stone-300 dark:text-slate-600 mb-2 block">
                event_note
              </span>
              <p className="text-stone-500 dark:text-slate-400">No reservations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 4)
                .map((reservation, index) => (
                  <div
                    key={reservation._id || index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-stone-200/30 dark:border-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-stone-600 flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-white text-sm">
                          event_seat
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">
                          {reservation.tableId?.name || `Table ${reservation.tableId?.tableNumber || 'N/A'}`} • {reservation.timeSlot || 'N/A'}
                        </p>
                        <p className="text-sm text-stone-500 dark:text-slate-400">
                          {reservation.date || 'N/A'} • {reservation.guests || 0} guests
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          reservation.status?.toLowerCase() === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : reservation.status?.toLowerCase() === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {reservation.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                ))}
              {reservations.length > 4 && (
                <div className="text-center pt-4">
                  <Link
                    to="/admin/all-reservations"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    View {reservations.length - 4} more reservations →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardMain;
