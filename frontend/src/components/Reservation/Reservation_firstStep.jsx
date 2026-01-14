import React, { useState } from 'react';
import { getAvailability } from '../../services/api';

const ReserveTable = ({ onNext, reservationData }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(reservationData?.currentMonth ?? today.getMonth());
  const [currentYear, setCurrentYear] = useState(reservationData?.currentYear ?? today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(reservationData?.selectedDate ?? today.getDate());
  const [selectedTime, setSelectedTime] = useState(reservationData?.selectedTime ?? '6:30 PM');
  const [selectedGuests, setSelectedGuests] = useState(reservationData?.selectedGuests ?? 2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const isTimeDisabled = (time) => {
    const selectedDateObj = new Date(currentYear, currentMonth, selectedDate);
    const today = new Date();
    const isToday = selectedDateObj.toDateString() === today.toDateString();

    if (!isToday) return false;

    // Parse the time string (e.g., "6:30 PM" -> hours and minutes)
    const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return false;

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const period = timeMatch[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const selectedTimeObj = new Date();
    selectedTimeObj.setHours(hours, minutes, 0, 0);

    return selectedTimeObj < today;
  };

  const handleGuestsChange = (event) => {
    const value = event.target.value;
    // Allow empty string for clearing
    if (value === '') {
      setSelectedGuests('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedGuests(numValue);
    }
  };

  const handleCheckAvailability = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate date is not in the past
      const selectedDateObj = new Date(currentYear, currentMonth, selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDateObj < today) {
        setError('Please select a date in the future');
        setLoading(false);
        return;
      }

      // Validate guests
      const guestCount = typeof selectedGuests === 'number' ? selectedGuests : parseInt(selectedGuests, 10);
      if (!guestCount || guestCount < 1) {
        setError('Please enter a valid number of guests');
        setLoading(false);
        return;
      }

      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      const params = {
        date,
        timeSlot: selectedTime,
        guests: guestCount
      };

      const response = await getAvailability(params);
      // Response is axios response object, data contains the array
      const availableTables = response?.data || [];

      if (availableTables.length === 0) {
        setError('No tables available for the selected date and time. Please try a different time slot.');
        setLoading(false);
        return;
      }

      const nextData = {
        currentMonth,
        currentYear,
        selectedDate,
        selectedTime,
        selectedGuests: guestCount,
        availableTables
      };

      onNext(nextData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to check availability. Please try again.';
      setError(errorMessage);
      console.error('Availability check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dark min-h-screen bg-black relative z-10 flex-grow flex flex-col items-center justify-start py-8 px-4 lg:px-8">
      <div className="w-full max-w-5xl flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-2 pt-20">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white tracking-tight">
              Reserve Your Table
            </h1>
            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">
              Experience our cozy ambiance and exquisite flavors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary dark:bg-accent-teal text-[#181511] dark:text-black text-xs font-bold">
                1
              </span>
              <span className="text-primary dark:text-accent-teal">Date &amp; Time</span>
            </div>
            <div className="w-8 h-[1px] bg-border dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 text-text-muted/60 dark:text-gray-500">
              <span className="flex items-center justify-center size-6 rounded-full border border-current text-xs">
                2
              </span>
              <span>Details</span>
            </div>
            <div className="w-8 h-[1px] bg-border dark:bg-gray-600"></div>
            <div className="flex items-center gap-2 text-text-muted/60 dark:text-gray-500">
              <span className="flex items-center justify-center size-6 rounded-full border border-current text-xs">
                3
              </span>
              <span>Confirm</span>
            </div>
          </div>
        </div>

        {/* Main Glass Panel */}
        <div className="glass-panel dark:bg-gray-800/50 dark:backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[500px]">

          {/* LEFT COLUMN */}
          <div className="flex-1 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border dark:border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-text-main dark:text-white">
                <span className="material-symbols-outlined text-primary dark:text-accent-teal">
                  calendar_month
                </span>
                Select Date
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-main dark:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <span className="font-medium text-sm self-center text-text-main dark:text-white">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-main dark:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm mb-4">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(day => (
                <span
                  key={day}
                  className="text-text-muted dark:text-gray-400 font-medium text-xs uppercase tracking-wide py-2"
                >
                  {day}
                </span>
              ))}

              {(() => {
                const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                const today = new Date();
                const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
                const todayDate = today.getDate();
                
                const calendarDays = [];
                
                // Empty cells for days before the first day of the month
                for (let i = 0; i < firstDay; i++) {
                  calendarDays.push(
                    <button key={`empty-${i}`} className="size-10 rounded-full text-text-muted/30 dark:text-gray-600" disabled>
                      {new Date(currentYear, currentMonth, -i).getDate()}
                    </button>
                  );
                }
                
                // Days of the month
                for (let d = 1; d <= daysInMonth; d++) {
                  const dateObj = new Date(currentYear, currentMonth, d);
                  const isPast = dateObj < today && (dateObj.getDate() !== todayDate || !isCurrentMonth);
                  const isSelected = selectedDate === d;
                  
                  calendarDays.push(
                    <button
                      key={d}
                      onClick={() => !isPast && handleDateSelect(d)}
                      disabled={isPast}
                      className={`size-10 rounded-full transition-colors ${
                        isSelected
                          ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/30 dark:shadow-accent-teal/30"
                          : isPast
                          ? "text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                          : "text-text-main dark:text-white hover:bg-primary/20 dark:hover:bg-accent-teal/20 hover:text-primary dark:hover:text-accent-teal"
                      }`}
                    >
                      {d}
                    </button>
                  );
                }
                
                return calendarDays;
              })()}
            </div>

            {/* Party Size */}
            <div className="mt-8">
              <label className="block text-sm font-bold mb-3 flex items-center gap-2 text-text-main dark:text-white">
                <span className="material-symbols-outlined text-primary dark:text-accent-teal">
                  groups
                </span>
                Party Size
              </label>

              <input
                type="number"
                value={selectedGuests}
                onChange={handleGuestsChange}
                min="1"
                className="w-full h-12 glass-input dark:bg-gray-700/50 dark:border-gray-600 rounded-lg px-4 text-text-main dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent-teal font-medium"
                placeholder="Enter number of guests"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-text-main dark:text-white">
              <span className="material-symbols-outlined text-primary dark:text-accent-teal">
                schedule
              </span>
              Select Time
            </h3>

            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-gray-400 mb-3">
                  Lunch
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => !isTimeDisabled('11:30 AM') && handleTimeSelect('11:30 AM')}
                    disabled={isTimeDisabled('11:30 AM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '11:30 AM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('11:30 AM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    11:30 AM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('12:00 PM') && handleTimeSelect('12:00 PM')}
                    disabled={isTimeDisabled('12:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '12:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('12:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    12:00 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('12:30 PM') && handleTimeSelect('12:30 PM')}
                    disabled={isTimeDisabled('12:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '12:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('12:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    12:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('1:00 PM') && handleTimeSelect('1:00 PM')}
                    disabled={isTimeDisabled('1:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '1:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('1:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    1:00 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('1:30 PM') && handleTimeSelect('1:30 PM')}
                    disabled={isTimeDisabled('1:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '1:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('1:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    1:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('2:00 PM') && handleTimeSelect('2:00 PM')}
                    disabled={isTimeDisabled('2:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '2:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('2:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    2:00 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('2:30 PM') && handleTimeSelect('2:30 PM')}
                    disabled={isTimeDisabled('2:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '2:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('2:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    2:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('3:00 PM') && handleTimeSelect('3:00 PM')}
                    disabled={isTimeDisabled('3:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '3:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('3:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    3:00 PM
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-gray-400 mb-3">
                  Dinner
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => !isTimeDisabled('5:30 PM') && handleTimeSelect('5:30 PM')}
                    disabled={isTimeDisabled('5:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '5:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('5:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    5:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('6:00 PM') && handleTimeSelect('6:00 PM')}
                    disabled={isTimeDisabled('6:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '6:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('6:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    6:00 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('6:30 PM') && handleTimeSelect('6:30 PM')}
                    disabled={isTimeDisabled('6:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '6:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('6:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    6:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('7:00 PM') && handleTimeSelect('7:00 PM')}
                    disabled={isTimeDisabled('7:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '7:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('7:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    7:00 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('7:30 PM') && handleTimeSelect('7:30 PM')}
                    disabled={isTimeDisabled('7:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '7:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('7:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    7:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('8:00 PM') && handleTimeSelect('8:00 PM')}
                    disabled={isTimeDisabled('8:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '8:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('8:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    8:00 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('8:30 PM') && handleTimeSelect('8:30 PM')}
                    disabled={isTimeDisabled('8:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '8:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('8:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    8:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('9:00 PM') && handleTimeSelect('9:00 PM')}
                    disabled={isTimeDisabled('9:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '9:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('9:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    9:00 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('9:30 PM') && handleTimeSelect('9:30 PM')}
                    disabled={isTimeDisabled('9:30 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '9:30 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('9:30 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    9:30 PM
                  </button>
                  <button
                    onClick={() => !isTimeDisabled('10:00 PM') && handleTimeSelect('10:00 PM')}
                    disabled={isTimeDisabled('10:00 PM')}
                    className={`py-2 px-1 rounded-lg transition-all text-sm font-medium ${
                      selectedTime === '10:00 PM'
                        ? "bg-primary dark:bg-accent-teal text-[#181511] dark:text-black font-bold shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 ring-2 ring-primary dark:ring-accent-teal ring-offset-2 ring-offset-background dark:ring-offset-gray-800"
                        : isTimeDisabled('10:00 PM')
                        ? "border border-border/30 dark:border-gray-600/30 text-text-muted/30 dark:text-gray-600 cursor-not-allowed"
                        : "border border-border dark:border-gray-600 hover:border-primary dark:hover:border-accent-teal hover:text-primary dark:hover:text-accent-teal text-text-main dark:text-white"
                    }`}
                  >
                    10:00 PM
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-border dark:border-gray-600">
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-text-muted dark:text-gray-400">Selected:</span>
                <span className="font-bold text-text-main dark:text-white">
                  {monthNames[currentMonth]} {selectedDate}, {selectedTime} • {selectedGuests || '?'} {selectedGuests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckAvailability}
                disabled={loading || !selectedGuests || selectedGuests < 1}
                className="w-full flex items-center justify-center gap-2 h-12 bg-primary dark:bg-accent-teal hover:bg-primary/90 dark:hover:bg-accent-teal/90 text-[#181511] dark:text-black text-base font-bold rounded-lg shadow-lg shadow-primary/20 dark:shadow-accent-teal/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-[#181511]/30 border-t-[#181511] rounded-full animate-spin"></div>
                )}
                {loading ? "Checking..." : "Check Availability"}
                {!loading && (
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                )}
              </button>

              <p className="text-center mt-4 text-xs text-text-muted dark:text-gray-400">
                Next step: Guest Details &amp; Dietary preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReserveTable;
