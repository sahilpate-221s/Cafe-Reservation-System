const ManageTablesMain = () => {
  return (
    <main className="flex-1 overflow-y-auto relative p-4 md:p-8 lg:px-12 lg:py-8 bg-background text-text-main transition-colors duration-300">
      {/* BACKGROUND BLOBS */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-900/10 dark:bg-teal-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* BREADCRUMB + TITLE */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <a className="text-text-muted hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
            <span className="material-symbols-outlined text-text-muted/50 text-[16px]">
              chevron_right
            </span>
            <span className="text-text-main font-medium">Table Management</span>
          </div>

          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-text-main text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                Table Management
              </h1>
              <p className="text-text-muted text-base font-normal">
                Configure seating layout and real-time table availability.
              </p>
            </div>

            <div className="flex gap-2">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-text-main border border-border rounded-lg text-sm font-semibold transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  refresh
                </span>
                Refresh Status
              </button>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-4">
            {/* ADD TABLE FORM */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                  <span className="material-symbols-outlined">
                    add_location_alt
                  </span>
                </div>
                <h2 className="text-text-main text-xl font-bold">
                  Add New Table
                </h2>
              </div>

              <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-text-muted text-sm font-semibold ml-1">
                    Table Number / Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
                      <span className="material-symbols-outlined text-[20px]">
                        tag
                      </span>
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Table 12 or Booth A"
                      className="w-full bg-input-bg border border-border text-text-main text-sm rounded-xl pl-10 p-3 focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-text-muted text-sm font-semibold ml-1">
                    Seating Capacity
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
                      <span className="material-symbols-outlined text-[20px]">
                        groups
                      </span>
                    </span>
                    <select className="w-full bg-input-bg border border-border text-text-main text-sm rounded-xl pl-10 p-3 appearance-none cursor-pointer">
                      <option>2 People</option>
                      <option>4 People</option>
                      <option>6 People</option>
                      <option>8 People</option>
                      <option>10+ People</option>
                    </select>
                    <span className="absolute inset-y-0 right-3 flex items-center text-text-muted">
                      <span className="material-symbols-outlined text-[24px]">
                        arrow_drop_down
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-text-muted text-sm font-semibold ml-1">
                    Zone Area
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
                      <span className="material-symbols-outlined text-[20px]">
                        map
                      </span>
                    </span>
                    <select className="w-full bg-input-bg border border-border text-text-main text-sm rounded-xl pl-10 p-3 appearance-none cursor-pointer">
                      <option>Main Dining</option>
                      <option>Patio</option>
                      <option>Bar Area</option>
                      <option>Private Room</option>
                    </select>
                    <span className="absolute inset-y-0 right-3 flex items-center text-text-muted">
                      <span className="material-symbols-outlined text-[24px]">
                        arrow_drop_down
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-input-bg border border-border">
                  <div>
                    <p className="text-text-main text-sm font-semibold">
                      Status
                    </p>
                    <p className="text-text-muted text-xs">
                      Available for booking
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-primary relative after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                </div>

                <button
                  type="button"
                  className="w-full text-white bg-primary hover:bg-primary/90 font-bold rounded-xl text-sm px-5 py-3.5 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create Table
                </button>
              </form>
            </div>

            {/* QUICK TIP */}
            <div className="glass-panel p-5 rounded-3xl flex flex-col gap-3">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary">
                  info
                </span>
                <h3 className="text-text-main font-bold text-sm">Quick Tip</h3>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">
                Use the 'Zone Area' to group tables for better management during
                peak hours. Inactive tables will not appear in the reservation
                system.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* FILTER BAR */}
            <div className="glass-panel rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">filter_list</span>
                </div>
                <div>
                  <h3 className="text-text-main font-bold text-sm leading-tight">
                    Table Filters
                  </h3>
                  <p className="text-text-muted text-xs">
                    Filter tables by status or zone
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-xl text-xs font-bold border border-border bg-primary text-white shadow-sm">
                  All Tables
                </button>

                <button className="px-4 py-2 rounded-xl text-xs font-bold border border-border hover:bg-green-500 hover:text-white transition-colors">
                  Available
                </button>

                <button className="px-4 py-2 rounded-xl text-xs font-bold border border-border hover:bg-amber-500 hover:text-white transition-colors">
                  Reserved
                </button>

                <button className="px-4 py-2 rounded-xl text-xs font-bold border border-border hover:bg-red-500 hover:text-white transition-colors">
                  Disabled
                </button>

                <select className="px-4 py-2 rounded-xl text-xs font-bold border border-border bg-input-bg text-text-main cursor-pointer">
                  <option>Main Dining</option>
                  <option>Patio</option>
                  <option>Bar Area</option>
                  <option>Private Room</option>
                </select>
              </div>
            </div>

            {/* TABLE CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* CARD 1 */}
              <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                  Available
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">table_bar</span>
                  </div>
                  <div>
                    <h3 className="text-text-main font-bold text-lg leading-tight">
                      Table 01
                    </h3>
                    <p className="text-text-muted text-xs">
                      Main Dining • 4 Seats
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </span>
                  <span className="text-green-500 font-bold text-sm">
                    Ready
                  </span>
                </div>

                <div className="flex gap-2 pt-2 mt-auto">
                  <button className="flex-1 px-3 py-2 rounded-xl border border-border text-text-main text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-xl border border-border text-text-main text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">
                    Disable
                  </button>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Reserved
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">table_bar</span>
                  </div>
                  <div>
                    <h3 className="text-text-main font-bold text-lg leading-tight">
                      Table 02
                    </h3>
                    <p className="text-text-muted text-xs">Patio • 2 Seats</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </span>
                  <span className="text-amber-500 font-bold text-sm">
                    Booked
                  </span>
                </div>

                <div className="flex gap-2 pt-2 mt-auto">
                  <button className="flex-1 px-3 py-2 rounded-xl border border-border text-text-main text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-xl border border-border text-text-main text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">
                    Disable
                  </button>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                  Disabled
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">table_bar</span>
                  </div>
                  <div>
                    <h3 className="text-text-main font-bold text-lg leading-tight">
                      Table 03
                    </h3>
                    <p className="text-text-muted text-xs">
                      Bar Area • 6 Seats
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </span>
                  <span className="text-red-500 font-bold text-sm">
                    Offline
                  </span>
                </div>

                <div className="flex gap-2 pt-2 mt-auto">
                  <button className="flex-1 px-3 py-2 rounded-xl border border-border text-text-main text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-xl border border-border text-text-main text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageTablesMain;
