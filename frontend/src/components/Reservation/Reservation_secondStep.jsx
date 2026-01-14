import React, { useState, useEffect, useRef } from "react";
import { bookReservation, acquireLock, releaseLock, getAvailability } from "../../services/api";

const Reservation_secondStep = ({ reservationData, onBack, onNext }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lockAcquired, setLockAcquired] = useState(false);
  const [acquiringLock, setAcquiringLock] = useState(false);
  const [availableTables, setAvailableTables] = useState(reservationData?.availableTables || []);
  const lockRefreshIntervalRef = useRef(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = reservationData
    ? `${monthNames[reservationData.currentMonth]} ${
        reservationData.selectedDate
      }`
    : "Oct 12";
  const formattedTime = reservationData
    ? reservationData.selectedTime
    : "7:00 PM";
  const guests = reservationData ? reservationData.selectedGuests : 2;

  const tables = availableTables;

  // Fetch available tables on component mount
  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const date = `${reservationData.currentYear}-${String(
          reservationData.currentMonth + 1
        ).padStart(2, "0")}-${String(reservationData.selectedDate).padStart(
          2,
          "0"
        )}`;
        const params = {
          date,
          timeSlot: reservationData.selectedTime,
          guests: reservationData.selectedGuests
        };

        const response = await getAvailability(params);
        const freshAvailableTables = response?.data || [];
        setAvailableTables(freshAvailableTables);
      } catch (err) {
        console.error("Failed to fetch available tables:", err);
        setError("Failed to load available tables. Please try again.");
      }
    };

    fetchAvailableTables();
  }, [reservationData.currentYear, reservationData.currentMonth, reservationData.selectedDate, reservationData.selectedTime, reservationData.selectedGuests]);

  // Cleanup lock refresh interval on unmount
  useEffect(() => {
    return () => {
      if (lockRefreshIntervalRef.current) {
        clearInterval(lockRefreshIntervalRef.current);
      }
    };
  }, []);

  const handleTableSelect = async (tableId) => {
    // Find the actual index in the original tables array
    const actualIndex = tables.findIndex(t => (t._id || t.id) === tableId);

    if (actualIndex === -1) return;

    // If clicking the same table, deselect it and release the lock
    if (selectedTable === actualIndex) {
      if (lockAcquired) {
        try {
          // Clear lock refresh interval
          if (lockRefreshIntervalRef.current) {
            clearInterval(lockRefreshIntervalRef.current);
            lockRefreshIntervalRef.current = null;
          }

          const selectedTableData = tables[selectedTable];
          const date = `${reservationData.currentYear}-${String(
            reservationData.currentMonth + 1
          ).padStart(2, "0")}-${String(reservationData.selectedDate).padStart(
            2,
            "0"
          )}`;
          await releaseLock({
            tableId: selectedTableData._id || selectedTableData.id,
            date,
            timeSlot: reservationData.selectedTime,
          });
        } catch (err) {
          console.error("Failed to release lock on deselect:", err);
        }
      }
      setSelectedTable(null);
      setLockAcquired(false);
      setError(null);
      return;
    }

    // If selecting a different table, release the previous lock first
    if (selectedTable !== null && selectedTable !== actualIndex && lockAcquired) {
      try {
        // Clear previous lock refresh interval
        if (lockRefreshIntervalRef.current) {
          clearInterval(lockRefreshIntervalRef.current);
          lockRefreshIntervalRef.current = null;
        }

        const prevTableData = tables[selectedTable];
        const date = `${reservationData.currentYear}-${String(
          reservationData.currentMonth + 1
        ).padStart(2, "0")}-${String(reservationData.selectedDate).padStart(
          2,
          "0"
        )}`;
        await releaseLock({
          tableId: prevTableData._id || prevTableData.id,
          date,
          timeSlot: reservationData.selectedTime,
        });
      } catch (err) {
        console.error("Failed to release previous lock:", err);
      }
    }

    setSelectedTable(actualIndex);
    setError(null);
    setLockAcquired(false);

    // Acquire lock for the newly selected table
    if (actualIndex !== null) {
      setAcquiringLock(true);
      try {
        const selectedTableData = tables[actualIndex];
        const date = `${reservationData.currentYear}-${String(
          reservationData.currentMonth + 1
        ).padStart(2, "0")}-${String(reservationData.selectedDate).padStart(
          2,
          "0"
        )}`;

        await acquireLock({
          tableId: selectedTableData._id || selectedTableData.id,
          date,
          timeSlot: reservationData.selectedTime,
        });
        setLockAcquired(true);

        // Note: Lock expires in 5 minutes. User should complete booking within this time.
        // If lock expires, user will need to select the table again.
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to lock table. It may be selected by another user.';
        setError(errorMessage);
        setSelectedTable(null);
        console.error("Lock acquisition failed:", err);
      } finally {
        setAcquiringLock(false);
      }
    }
  };

  const handleConfirmTable = async () => {
    if (selectedTable === null || !lockAcquired) {
      setError('Please select a table first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedTableData = tables[selectedTable];
      const date = `${reservationData.currentYear}-${String(
        reservationData.currentMonth + 1
      ).padStart(2, "0")}-${String(reservationData.selectedDate).padStart(
        2,
        "0"
      )}`;

      const bookingData = {
        tableId: selectedTableData._id || selectedTableData.id,
        date,
        timeSlot: reservationData.selectedTime,
        guests: reservationData.selectedGuests,
      };

      // Clear lock refresh interval before booking
      if (lockRefreshIntervalRef.current) {
        clearInterval(lockRefreshIntervalRef.current);
        lockRefreshIntervalRef.current = null;
      }

      const response = await bookReservation(bookingData);
      // Lock will be released by backend after successful booking
      setLockAcquired(false);
      onNext({
        ...reservationData,
        selectedTable: selectedTableData,
        reservation: response.reservation || response,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to book reservation. Please try again.';
      setError(errorMessage);
      console.error("Booking failed:", err);
      // Release lock on booking failure
      if (lockAcquired && selectedTable !== null) {
        try {
          const selectedTableData = tables[selectedTable];
          const date = `${reservationData.currentYear}-${String(
            reservationData.currentMonth + 1
          ).padStart(2, "0")}-${String(reservationData.selectedDate).padStart(
            2,
            "0"
          )}`;
          // Clear lock refresh interval
          if (lockRefreshIntervalRef.current) {
            clearInterval(lockRefreshIntervalRef.current);
            lockRefreshIntervalRef.current = null;
          }
          
          await releaseLock({
            tableId: selectedTableData._id || selectedTableData.id,
            date,
            timeSlot: reservationData.selectedTime,
          });
          setLockAcquired(false);
        } catch (releaseErr) {
          console.error("Failed to release lock after booking error:", releaseErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black pt-20">
      <main className="flex-1 flex flex-col w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 gap-8">
        {/* Progress */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-6 justify-between items-end">
            <div className="flex flex-col gap-1">
              <p className="text-primary text-xs font-bold tracking-widest uppercase dark:text-white">
                Step 2 of 3
              </p>
              <h1 className="text-content text-3xl sm:text-4xl font-bold leading-tight text-white">
                Select Your Table
              </h1>
            </div>
            <p className="text-gray-400 text-sm font-medium dark:text-white">
              66% Completed
            </p>
          </div>

          <div className="rounded-full bg-muted/20 overflow-hidden h-2">
            <div
              className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
              style={{ width: "66%" }}
            />
          </div>
        </div>

        {/* Summary Bar */}
        <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-all duration-300">
          <div className="flex flex-wrap gap-3">
            <div className="flex h-10 items-center gap-x-2 rounded-lg bg-content/5 border border-content/5 px-4 hover:bg-content/10 cursor-pointer">
              <span className="material-symbols-outlined text-primary text-[20px]">
                calendar_today
              </span>
              <p className="text-content text-sm font-medium dark:text-white">
                {formattedDate}
              </p>
            </div>

            <div className="flex h-10 items-center gap-x-2 rounded-lg bg-content/5 border border-content/5 px-4 hover:bg-content/10 cursor-pointer">
              <span className="material-symbols-outlined text-primary text-[20px]">
                schedule
              </span>
              <p className="text-content text-sm font-medium dark:text-white">
                {formattedTime}
              </p>
            </div>

            <div className="flex h-10 items-center gap-x-2 rounded-lg bg-content/5 border border-content/5 px-4 hover:bg-content/10 cursor-pointer">
              <span className="material-symbols-outlined text-primary text-[20px]">
                group
              </span>
              <p className="text-content text-sm font-medium dark:text-white">
                {guests} Guests
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="text-primary text-sm font-bold hover:text-content transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-primary/10 dark:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Modify
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />
            <span className="text-sm text-content font-medium dark:text-white">
              Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full border border-content/30 bg-content/10" />
            <span className="text-sm text-content font-medium dark:text-white">
              Available
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-muted/40" />
            <span className="text-sm text-muted dark:text-white">Reserved</span>
          </div>
        </div>

        {/* Table Grid */}
        {tables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                restaurant
              </span>
              <h3 className="text-xl font-bold text-text-main dark:text-white">
                No Tables Available
              </h3>
              <p className="text-text-muted dark:text-gray-400 max-w-md">
                Unfortunately, there are no tables available for the selected date and time. Please try selecting a different time slot or date.
              </p>
              <button
                onClick={onBack}
                className="mt-6 px-6 py-3 bg-primary dark:bg-accent-teal text-white text-sm font-bold rounded-lg hover:bg-primary/90 dark:hover:bg-accent-teal/90 transition-colors"
              >
                Go Back & Select Different Time
              </button>
            </div>
          </div>
        ) : (() => {
          const suitableTables = tables.filter(table => table.capacity >= guests);
          return suitableTables.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                  group
                </span>
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  No Tables for {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </h3>
                <p className="text-text-muted dark:text-gray-400 max-w-md">
                  There are no tables available that can accommodate {guests} {guests === 1 ? 'guest' : 'guests'}. Please try selecting a different number of guests or time slot.
                </p>
                <button
                  onClick={onBack}
                  className="mt-6 px-6 py-3 bg-primary dark:bg-accent-teal text-white text-sm font-bold rounded-lg hover:bg-primary/90 dark:hover:bg-accent-teal/90 transition-colors"
                >
                  Go Back & Modify
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suitableTables.map((table) => {
                const originalIndex = tables.findIndex(t => (t._id || t.id) === (table._id || table.id));
                return (
            <div
              key={table._id || table.id}
              className={`glass-card relative rounded-2xl overflow-hidden transition-all duration-300 ${
                selectedTable === originalIndex ? "selected scale-[1.01] ring-2 ring-primary dark:ring-accent-teal" : ""
              } ${
                acquiringLock ? "cursor-wait opacity-50" : "cursor-pointer"
              }`}
              onClick={() => !acquiringLock && handleTableSelect(table._id || table.id)}
            >
              {selectedTable === originalIndex && (
                <div className="absolute top-3 right-3 z-20">
                  <div className={`size-7 rounded-full flex items-center justify-center shadow-lg ${
                    lockAcquired ? "bg-primary dark:bg-accent-teal text-white dark:text-[#1A1D21]" : "bg-yellow-500 text-white"
                  }`}>
                    {acquiringLock ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">
                        {lockAcquired ? "check" : "lock"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div
                className="h-44 w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url('${table.image}')`,
                }}
              >
                <div className="absolute inset-0 card-overlay opacity-90" />
              </div>

              <div className="p-5 relative -mt-12 z-10">
                <h3 className="text-white text-xl font-bold tracking-tight text-shadow-sm">
                  {table.name}
                </h3>
                <p className="text-primary text-[11px] font-bold uppercase tracking-widest mb-2">
                  {table.location}
                </p>

                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      person
                    </span>
                    <span className="text-sm font-medium">
                      Suitable for {table.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      visibility
                    </span>
                    <span className="text-sm font-medium">{table.view}</span>
                  </div>
                </div>
              </div>
            </div>
                );
              })}
          </div>
          );
        })()}

        {/* Error Display */}
        {error && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        )}

        {/* Modal Action Buttons */}
        {selectedTable !== null && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-t border-white/10">
            <div className="flex justify-center gap-4 py-4 px-4">
              <button
                onClick={async () => {
                  if (selectedTable !== null && lockAcquired) {
                    try {
                      // Clear lock refresh interval
                      if (lockRefreshIntervalRef.current) {
                        clearInterval(lockRefreshIntervalRef.current);
                        lockRefreshIntervalRef.current = null;
                      }
                      
                      const selectedTableData = tables[selectedTable];
                      const date = `${reservationData.currentYear}-${String(
                        reservationData.currentMonth + 1
                      ).padStart(2, "0")}-${String(reservationData.selectedDate).padStart(
                        2,
                        "0"
                      )}`;

                      await releaseLock({
                        tableId: selectedTableData._id || selectedTableData.id,
                        date,
                        timeSlot: reservationData.selectedTime,
                      });
                    } catch (err) {
                      console.error("Failed to release lock on back:", err);
                    }
                  }
                  setSelectedTable(null);
                  setLockAcquired(false);
                  onBack();
                }}
                disabled={loading}
                className="px-6 py-3 text-sm font-bold text-muted hover:text-content transition-colors dark:text-white border border-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleConfirmTable}
                disabled={loading || !lockAcquired}
                className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {loading ? "Booking..." : lockAcquired ? "Confirm Table" : "Acquiring Lock..."}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reservation_secondStep;
