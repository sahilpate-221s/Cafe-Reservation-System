import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/api";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white selection:bg-primary selection:text-background-dark flex items-center justify-center p-2 pt-18">
      <div className="w-full max-w-4xl rounded-6xl">
        <div className="flex  w-full flex-col lg:flex-row overflow-hidden h-[70%] rounded-4xl ">
          {/* LEFT SIDE */}
          <div className="relative flex w-full flex-col items-center justify-center p-6 lg:w-1/2 lg:p-12 bg-background-light dark:bg-background-dark overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-teal-800/10 blur-[100px] dark:bg-teal-900/20" />



            <div className="relative z-10 w-full max-w-[440px] animate-fade-in-up">
              <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-glass-light p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-glass-dark">
                {/* HEADER */}
                <div className="mb-2 flex flex-col items-center text-center">
                  <h1 className="mb-2 text-2xl font-black tracking-tight">
                    Create Account
                  </h1>
                </div>

                {/* FORM */}
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmit}
                >
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {/* FULL NAME */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative h-8">
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer h-8 w-full rounded-lg border border-slate-300 bg-white/60 px-4 pl-11 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500 transition-all"
                      />
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-primary dark:text-slate-500 transition-colors material-symbols-outlined text-[8px]">person</span>
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative h-8">
                      <input
                        type="email"
                        name="email"
                        placeholder="user@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="peer h-8 w-full rounded-lg border border-slate-300 bg-white/60 px-4 pl-11 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500 transition-all"
                      />
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-primary dark:text-slate-500 transition-colors material-symbols-outlined text-[4px]">mail</span>
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative h-8">
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="peer h-8 w-full rounded-lg border border-slate-300 bg-white/60 px-4 pl-11 pr-11 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500 transition-all"
                      />
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-primary dark:text-slate-500 transition-colors material-symbols-outlined text-[4px]">lock</span>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                      >
                        
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative h-8">
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="peer h-8 w-full rounded-lg border border-slate-300 bg-white/60 px-4 pl-11 pr-11 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500 transition-all"
                      />
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-primary dark:text-slate-500 transition-colors material-symbols-outlined text-[10px]">lock</span>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                      >
                        
                      </button>
                    </div>
                  </div>

                 

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-primary text-base font-bold text-background-dark shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="mr-2">{loading ? 'Signing Up...' : 'Sign Up'}</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </form>



                {/* LOGIN */}
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link
                      className="font-bold text-primary hover:text-primary-dark hover:underline transition-colors"
                      to="/login"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
              </div>

              {/* FOOTER LINKS */}
              <div className="mt-6 flex justify-center gap-6 text-sm text-slate-400 dark:text-slate-500 opacity-80">
                <a
                  className="hover:text-primary hover:underline transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="hover:text-primary hover:underline transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <div className="absolute inset-0 h-full">
              <img
                className="h-full w-full object-fill"
                alt="Cafe Ambience"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRWVOju8HPMasoAkJbA49-DaJIAU1wqI722w1u8unb1wOG585wpQ9pbmp5xT2l0pFmU1CzI3sgcqBXKSQowMx2DExg_FDIeABDtVdkJj0sA47y2CwgqYTv5u3WfQ6kWTgd4z5q7YVrqCTeN3T4_lH8_48ypjoGOkzTa8LZL72Qf-qL0D--kbnfhlMa4xmB0csCr3Ifdv0LnjmkDgnFES1kZINTunreCNG-GXFAgNZ2Wt3C7i_-YQilxgnawUOsolX8n20uq80XBkk"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background-dark/90 via-background-dark/20 to-transparent" />
              <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply" />
            </div>

            <div className="absolute bottom-12 left-12 right-12 z-10 max-w-lg">
              <div className="mb-4 inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                Premium Experience
              </div>
              <h2 className="text-4xl font-bold leading-tight text-white mb-4 drop-shadow-md">
                Experience the perfect blend of cozy and classy.
              </h2>
              <p className="text-lg text-slate-200 font-medium drop-shadow-sm opacity-90">
                Reserve your spot, explore our menu, and immerse yourself in the
                Luxe Cafe ambience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
