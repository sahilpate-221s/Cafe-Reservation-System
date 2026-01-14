import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetReservation, setReservationStep } from '../../store/slices/reservationSlice';
import { getMe } from '../../services/api';

const ReservationConfirmed = ({ reservationData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formattedDate = reservationData ? `${monthNames[reservationData.currentMonth]} ${reservationData.selectedDate}, ${reservationData.currentYear}` : 'Friday, Oct 24';
  const formattedTime = reservationData ? reservationData.selectedTime : '7:30 PM';
  const guests = reservationData ? `${reservationData.selectedGuests} People` : '4 People';
  const tableName = reservationData?.selectedTable ? reservationData.selectedTable.name : 'Table 12';
  const location = reservationData?.selectedTable ? reservationData.selectedTable.location : 'Main Dining Hall';
  const view = reservationData?.selectedTable ? reservationData.selectedTable.view : 'Window Seat';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Don't break the UI if user fetch fails - just use default "Guest"
        setUser(null);
      }
    };

    fetchUser();
  }, []);


  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Guest';
  };

  const handleModifyBooking = () => {
    dispatch(resetReservation());
    dispatch(setReservationStep(1));
    navigate('/reservation');
  };

  const handleReturnHome = () => {
    navigate('/');
  };
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-charcoal dark:text-silver-light min-h-screen flex flex-col antialiased selection:bg-primary/20 dark:selection:bg-teal-accent/30 pt-20" >

      <main className="relative flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden pt-20">

        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-center bg-cover bg-no-repeat scale-[1.02] saturate-[0.8]"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJEppRvoYD6easPRYCY9rQtVkHbVsHFYqIDQQ-zeFVt6ngEUYLVx1NGFqS3xz_zJaPrMewxSN4t0n9cNWG-CfLb0QCHNcN3lqyHVzToC_0Ke5jmD26rAic_anGDgp-TKUcsdQQaC4Bf0x-ZB68215BEx8HAxrP5zfH2nbWCVZcfkZgYM6mMPofIJzOuUrd5v2wnXZO5yKWMcJCLto-CTdsINWtKMMooclc_O9kNmEMk4Vaosc7hCeSJTFi-M_trESD2UGqFWuOHe8")',
            }}
          />
          <div className="absolute inset-0 bg-background-light/40 dark:bg-[#0f1115]/90 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/50 to-background-light dark:via-[#0f1115]/80 dark:to-[#0f1115]" />
        </div>

        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-primary/20 dark:bg-teal-accent/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40 animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-primary/10 dark:bg-teal-accent/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-40" />

        <div className="relative z-10 w-full max-w-2xl glass-card rounded-[2rem] p-8 md:p-12 flex flex-col gap-10">

          <div className="text-center space-y-6">
            <div className="relative inline-flex mb-2">
              <div className="absolute inset-0 bg-primary/20 dark:bg-teal-accent/20 rounded-full blur-xl animate-pulse" />
              <div className="relative size-24 rounded-full bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-white/0 border border-white/60 dark:border-white/10 flex items-center justify-center primary-glow shadow-inner">
                <span className="material-symbols-outlined text-primary dark:text-teal-glow text-5xl fill-1">
                  check_circle
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold text-charcoal dark:text-white tracking-tight drop-shadow-sm">
                Reservation Confirmed
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-silver font-medium">
                We look forward to hosting you,{" "}
                <span className="text-primary dark:text-teal-glow font-semibold">
                  {getUserDisplayName()}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="glass-section rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 dark:via-teal-accent/30 to-transparent opacity-60" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10">

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-white/80 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                  <span className="material-symbols-outlined text-gray-600 dark:text-silver-light">
                    calendar_month
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                    Date
                  </p>
                  <p className="text-xl font-bold text-charcoal dark:text-white">
                    {formattedDate.split(', ')[0]}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-silver/70">
                    {formattedDate.split(', ')[1]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-white/80 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                  <span className="material-symbols-outlined text-gray-600 dark:text-silver-light">
                    schedule
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                    Time
                  </p>
                  <p className="text-xl font-bold text-charcoal dark:text-white">
                    {formattedTime}
                  </p>
                  <p className="text-sm font-bold text-primary dark:text-teal-glow">
                    Standard Seating
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-white/80 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                  <span className="material-symbols-outlined text-gray-600 dark:text-silver-light">
                    group
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                    Guests
                  </p>
                  <p className="text-xl font-bold text-charcoal dark:text-white">
                    {guests}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-silver/70">
                    {tableName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-white/80 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                  <span className="material-symbols-outlined text-gray-600 dark:text-silver-light">
                    restaurant
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                    Location
                  </p>
                  <p className="text-xl font-bold text-charcoal dark:text-white">
                    {location}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-silver/70">
                    {view}
                  </p>
                </div>
              </div>

            </div>

            <div className=" border-t border-gray-200/60 dark:border-white/5" />
          </div>

          <div className="flex flex-col gap-6 text-center">

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleModifyBooking}
                className="order-2 sm:order-1 px-8 py-3.5 rounded-xl border border-gray-300 dark:border-white/10 text-charcoal dark:text-white font-bold text-sm w-full sm:w-auto cursor-pointer"
              >
                Modify Booking
              </button>
              <button
                onClick={handleReturnHome}
                className="order-1 sm:order-2 px-8 py-3.5 rounded-xl bg-primary dark:bg-teal-accent text-white font-bold text-sm shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  home
                </span>
                Return Home
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ReservationConfirmed;
