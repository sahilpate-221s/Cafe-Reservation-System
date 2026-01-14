import React, { useState, useEffect } from 'react';
import { getMe } from '../../services/api';
import AdminLayout from './AdminLayout';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [settings, setSettings] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    closingHours: '',
    maxReservationsPerDay: '',
    reservationDuration: '',
    currency: 'USD'
  });

  const [formErrors, setFormErrors] = useState({});

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        if (response.data.role !== 'ADMIN') {
          return;
        }
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) fetchSettings();
  }, [user]);

  /* ---------------- DATA ---------------- */
  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      // TODO: Implement API call to fetch settings
      // const res = await getSettings();
      // setSettings(res);
      // For now, using default values
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsLoading(false);
    }
  };

  /* ---------------- FORM ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!settings.restaurantName) errors.restaurantName = 'Required';
    if (!settings.address) errors.address = 'Required';
    if (!settings.phone) errors.phone = 'Required';
    if (!settings.email) errors.email = 'Required';
    if (!settings.openingHours) errors.openingHours = 'Required';
    if (!settings.closingHours) errors.closingHours = 'Required';
    if (!settings.maxReservationsPerDay || settings.maxReservationsPerDay < 1) errors.maxReservationsPerDay = 'Invalid';
    if (!settings.reservationDuration || settings.reservationDuration < 30) errors.reservationDuration = 'Minimum 30 minutes';
    return errors;
  };

  const handleSaveSettings = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) return setFormErrors(errors);

    setSubmitLoading(true);
    try {
      // TODO: Implement API call to save settings
      // await updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="relative z-10 max-w-[1280px] mx-auto p-6 lg:p-10 flex flex-col gap-10 bg-[#15171a] min-h-screen">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
              System Settings
            </h1>
            <p className="text-stone-500 dark:text-slate-400 text-base">
              Configure restaurant settings and preferences.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        {settingsLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* GENERAL SETTINGS */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-white/5 text-slate-100">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Restaurant Name</label>
                  <input
                    name="restaurantName"
                    value={settings.restaurantName}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Restaurant Name"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.restaurantName && <p className="text-xs text-red-400 mt-1">{formErrors.restaurantName}</p>}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Phone</label>
                  <input
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.phone && <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-300 mb-1">Address</label>
                  <input
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Restaurant Address"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.address && <p className="text-xs text-red-400 mt-1">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Email</label>
                  <input
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="Contact Email"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Currency</label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* OPERATING HOURS */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-white/5 text-slate-100">
              <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Opening Time</label>
                  <input
                    name="openingHours"
                    value={settings.openingHours}
                    onChange={handleInputChange}
                    type="time"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.openingHours && <p className="text-xs text-red-400 mt-1">{formErrors.openingHours}</p>}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Closing Time</label>
                  <input
                    name="closingHours"
                    value={settings.closingHours}
                    onChange={handleInputChange}
                    type="time"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.closingHours && <p className="text-xs text-red-400 mt-1">{formErrors.closingHours}</p>}
                </div>
              </div>
            </div>

            {/* RESERVATION SETTINGS */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-white/5 text-slate-100">
              <h2 className="text-xl font-semibold mb-4">Reservation Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Max Reservations Per Day</label>
                  <input
                    name="maxReservationsPerDay"
                    value={settings.maxReservationsPerDay}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.maxReservationsPerDay && <p className="text-xs text-red-400 mt-1">{formErrors.maxReservationsPerDay}</p>}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Reservation Duration (minutes)</label>
                  <input
                    name="reservationDuration"
                    value={settings.reservationDuration}
                    onChange={handleInputChange}
                    type="number"
                    min="30"
                    step="15"
                    placeholder="120"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formErrors.reservationDuration && <p className="text-xs text-red-400 mt-1">{formErrors.reservationDuration}</p>}
                </div>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-primary text-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {submitLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Settings;
