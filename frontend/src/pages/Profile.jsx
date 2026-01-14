import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/slices/userSlice';
import { updateProfile } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user } = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: {
      notifications: true,
      newsletter: false,
      dietaryRestrictions: ''
    }
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        try {
          await dispatch(fetchUser()).unwrap();
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          navigate('/login');
          return;
        }
      }

      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          preferences: {
            notifications: user.preferences?.notifications ?? true,
            newsletter: user.preferences?.newsletter ?? false,
            dietaryRestrictions: user.preferences?.dietaryRestrictions || ''
          }
        });
      }
      setLoading(false);
    };

    loadUserData();
  }, [navigate, dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-charcoal dark:text-silver-light min-h-screen flex flex-col antialiased selection:bg-primary/20 dark:selection:bg-teal-accent/30 pt-20">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-charcoal dark:text-silver-light min-h-screen flex flex-col antialiased selection:bg-primary/20 dark:selection:bg-teal-accent/30 pt-20">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/10 dark:bg-teal-accent/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40 animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 dark:bg-teal-accent/3 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-40" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
        <div className="w-full max-w-4xl">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-primary/20 dark:bg-teal-accent/20 rounded-full blur-xl animate-pulse" />
              <div className="relative size-20 rounded-full bg-gradient-to-br from-white/80 to-white/40 dark:from-white/5 dark:to-white/0 border border-white/60 dark:border-white/10 flex items-center justify-center primary-glow shadow-inner">
                <span className="material-symbols-outlined text-primary dark:text-teal-glow text-4xl fill-1">
                  person
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-charcoal dark:text-white tracking-tight drop-shadow-sm mb-4">
              Your Profile
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-silver font-medium">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Form */}
          <div className="glass-card rounded-[2rem] p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Success/Error Message */}
              {message && (
                <div className={`p-4 rounded-xl text-center font-semibold ${
                  message.includes('successfully')
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}>
                  {message}
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-charcoal dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-silver">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-silver">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-silver">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-charcoal dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                  Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                    <div>
                      <h3 className="font-semibold text-charcoal dark:text-white">Email Notifications</h3>
                      <p className="text-sm text-gray-600 dark:text-silver/70">Receive updates about your reservations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferences.notifications"
                        checked={formData.preferences.notifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-teal-accent/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-teal-accent"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                    <div>
                      <h3 className="font-semibold text-charcoal dark:text-white">Newsletter</h3>
                      <p className="text-sm text-gray-600 dark:text-silver/70">Subscribe to our monthly newsletter</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferences.newsletter"
                        checked={formData.preferences.newsletter}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-teal-accent/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-teal-accent"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-silver">
                      Dietary Restrictions
                    </label>
                    <textarea
                      name="preferences.dietaryRestrictions"
                      value={formData.preferences.dietaryRestrictions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-teal-accent focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Let us know about any dietary restrictions or preferences..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-8 py-3 rounded-xl border border-gray-300 dark:border-white/10 text-charcoal dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 rounded-xl bg-primary dark:bg-teal-accent text-white font-bold text-sm shadow-lg hover:shadow-primary/40 dark:hover:shadow-teal-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
