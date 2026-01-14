import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/slices/userSlice';
import { getMyReservations } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user } = useSelector(state => state.user);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        try {
          await dispatch(fetchUser()).unwrap();
        } catch (error) {
          console.error('Auth check failed:', error);
          navigate('/login');
          return;
        }
      }

      if (user && user.role === 'admin') {
        navigate('/admin-dashboard');
        return;
      }

      // Fetch reservations after auth check
      try {
        const reservationsResponse = await getMyReservations();
        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, dispatch, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const now = new Date();

  const pastReservations = reservations.filter(res => {
    const reservationDate = new Date(res.date);
    // Assuming timeSlot is like "7:00 PM", parse it
    const [time, period] = res.timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;
    reservationDate.setHours(adjustedHours, minutes, 0, 0);
    return reservationDate < now;
  });

  const upcomingReservations = reservations.filter(res => {
    const reservationDate = new Date(res.date);
    // Assuming timeSlot is like "7:00 PM", parse it
    const [time, period] = res.timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;
    reservationDate.setHours(adjustedHours, minutes, 0, 0);
    return reservationDate >= now;
  });

  const pastVisitsCount = pastReservations.length;
  const upcomingCount = upcomingReservations.length;

  const lastVisit = pastReservations.length > 0
    ? new Date(Math.max(...pastReservations.map(r => new Date(r.date)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'N/A';

  const nextReservation = upcomingReservations.length > 0
    ? new Date(Math.min(...upcomingReservations.map(r => new Date(r.date)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'N/A';

  const userName = user?.name || 'User';

  return (
    <>
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 bg-pattern opacity-10 dark:opacity-[0.05] dark:bg-black/20" />
      <div className="fixed inset-0 z-0 bg-background/90 dark:bg-black/90 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 dark:opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen pt-20">
        {/* MAIN */}
        <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                <span className="material-symbols-outlined text-sm">dashboard</span>
                User Dashboard
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-stone-900 dark:text-white drop-shadow-sm leading-tight">
                Welcome back,{" "}
                <span className="italic text-stone-500 dark:text-secondary">
                  {userName}
                </span>
              </h1>

              <p className="text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-2xl font-medium leading-relaxed">
                You have{" "}
                <span className="text-primary font-bold decoration-primary/30 underline decoration-2 underline-offset-4">
                  {upcomingCount} upcoming
                </span>{" "}
                reservations planned. We look forward to serving you again.
              </p>
            </div>

            <div className="lg:col-span-4 flex gap-4 w-full">
              <div className="flex-1 glass-card p-5 rounded-3xl flex flex-col justify-between min-h-[140px] border-l-4 border-l-stone-300 dark:border-l-stone-700 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-8xl">
                    history
                  </span>
                </div>
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                  Past Visits
                </span>
                <div className="mt-auto">
                  <span className="text-4xl font-serif text-stone-900 dark:text-white">
                    {pastVisitsCount}
                  </span>
                  <p className="text-xs text-stone-400 dark:text-stone-400 mt-1 font-medium">
                    Last visit: {lastVisit}
                  </p>
                </div>
              </div>

              <div className="flex-1 glass-card p-5 rounded-3xl flex flex-col justify-between min-h-[140px] border-l-4 border-l-primary bg-primary/5 dark:bg-primary/5 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-primary opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-8xl">
                    event
                  </span>
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Upcoming
                </span>
                <div className="mt-auto">
                  <span className="text-4xl font-serif text-primary">{upcomingCount.toString().padStart(2, '0')}</span>
                  <p className="text-xs text-primary/70 mt-1 font-medium">
                    Next: {nextReservation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* UPCOMING RESERVATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-white flex items-center gap-3">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  Upcoming Reservations
                </h2>
              </div>

              {upcomingReservations.length > 0 ? (
                upcomingReservations.map((reservation) => (
                  <div key={reservation._id} className="glass-card rounded-[2rem] p-1 transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group">
                    <div className="relative bg-white/60 dark:bg-white/[0.03] rounded-[1.8rem] p-6 sm:p-8 flex flex-col md:flex-row gap-8 overflow-hidden">
                      <div className="flex-shrink-0 flex md:flex-col items-center justify-center bg-stone-100 dark:bg-white/5 rounded-2xl p-4 md:w-24 border border-stone-200 dark:border-white/5">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                          {new Date(reservation.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-3xl font-serif text-stone-900 dark:text-white">
                          {new Date(reservation.date).getDate()}
                        </span>
                        <span className="text-xs font-medium text-stone-400 dark:text-stone-500 mt-1">
                          {new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>

                      <div className="flex-grow space-y-4 relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${
                              reservation.status === 'CONFIRMED' 
                                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1'
                            }`}>
                              {reservation.status === 'CONFIRMED' ? (
                                'Confirmed'
                              ) : (
                                <>
                                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  {reservation.status}
                                </>
                              )}
                            </span>
                            <span className="text-xs font-mono text-stone-400 dark:text-stone-600">
                              #{reservation._id.slice(-6).toUpperCase()}
                            </span>
                          </div>

                          <span className="text-xl font-serif text-stone-900 dark:text-white font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-primary">
                              schedule
                            </span>
                            {reservation.timeSlot}
                          </span>
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-stone-800 dark:text-white">
                          Table for {reservation.guests} - {reservation.tableId?.name || 'Table'}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-stone-600 dark:text-stone-300">No upcoming reservations.</p>
              )}

              {/* PREVIOUS BOOKINGS */}
              {pastReservations.length > 0 && (
                <>
                  <div className="flex items-center justify-between mt-8">
                    <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-white flex items-center gap-3">
                      <span className="size-2 rounded-full bg-stone-500"></span>
                      Previous Bookings
                    </h2>
                  </div>

                  {pastReservations.map((reservation) => (
                    <div key={reservation._id} className="glass-card rounded-[2rem] p-1 transition-all duration-300 hover:shadow-2xl hover:border-stone-500/20 group">
                      <div className="relative bg-white/60 dark:bg-white/[0.03] rounded-[1.8rem] p-6 sm:p-8 flex flex-col md:flex-row gap-8 overflow-hidden">
                        <div className="flex-shrink-0 flex md:flex-col items-center justify-center bg-stone-100 dark:bg-white/5 rounded-2xl p-4 md:w-24 border border-stone-200 dark:border-white/5">
                          <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-widest mb-1">
                            {new Date(reservation.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-3xl font-serif text-stone-900 dark:text-white">
                            {new Date(reservation.date).getDate()}
                          </span>
                          <span className="text-xs font-medium text-stone-400 dark:text-stone-500 mt-1">
                            {new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>

                        <div className="flex-grow space-y-4 relative z-10">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20 shadow-sm">
                                Completed
                              </span>
                              <span className="text-xs font-mono text-stone-400 dark:text-stone-600">
                                #{reservation._id.slice(-6).toUpperCase()}
                              </span>
                            </div>

                            <span className="text-xl font-serif text-stone-900 dark:text-white font-medium flex items-center gap-2">
                              <span className="material-symbols-outlined text-lg text-stone-500">
                                schedule
                              </span>
                              {reservation.timeSlot}
                            </span>
                          </div>

                          <h3 className="text-2xl font-serif font-bold text-stone-800 dark:text-white">
                            Table for {reservation.guests} - {reservation.tableId?.name || 'Table'}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-stone-700 dark:text-silver font-serif tracking-wide opacity-90">
                Offers
              </h2>

              <div className="glass-card rounded-3xl p-6 relative overflow-hidden group border border-amber-500/20 bg-amber-500/5">
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <span className="material-symbols-outlined text-amber-500 text-3xl">
                      star
                    </span>
                    <span className="text-[10px] font-bold bg-amber-500 text-white dark:text-black px-2 py-1 rounded-full uppercase">
                      VIP Offer
                    </span>
                  </div>

                  <h4 className="text-stone-900 dark:text-white font-serif font-bold text-lg leading-tight mb-2">
                    Free Dessert on your next visit
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
                    Valid for bookings of 4+ guests this month.
                  </p>

                  <button
                    onClick={() => setShowErrorModal(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white dark:text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="mt-auto py-8 text-center z-10 border-t border-stone-200/50 dark:border-white/5 bg-background/50 dark:bg-black/20 backdrop-blur-sm">
          <div className="flex justify-center gap-8 mb-4">
            <a className="text-stone-500 dark:text-secondary hover:text-primary transition-colors text-sm font-medium">
              Privacy
            </a>
            <a className="text-stone-500 dark:text-secondary hover:text-primary transition-colors text-sm font-medium">
              Terms
            </a>
            <a className="text-stone-500 dark:text-secondary hover:text-primary transition-colors text-sm font-medium">
              Support
            </a>
          </div>
          <p className="text-xs text-stone-400 dark:text-stone-600 font-medium">
            © 2024 Lumière Cafe. All rights reserved.
          </p>
        </footer>
      </div>

      {/* ERROR MODAL */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 opacity-10">
              <span className="material-symbols-outlined text-8xl text-red-500">
                error
              </span>
            </div>

            <div className="relative z-10 text-center space-y-6">
              <div className="flex justify-center">
                <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-red-500">
                    error_outline
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                  Sorry, Not Available Right Now
                </h3>
                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                  This offer is currently unavailable. Please check back later or contact our support team for more information.
                </p>
              </div>

              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
