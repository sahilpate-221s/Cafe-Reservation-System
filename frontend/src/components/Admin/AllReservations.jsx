import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMe, getAllReservations, cancelReservation, getTables } from '../../services/apiService';
import AdminLayout from './AdminLayout';

const AllReservations = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reservations state
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);

  // Tables (to resolve tableId -> name/capacity)
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingRes, setCancellingRes] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (user) {
      fetchReservations();
      fetchTables();
    }
  }, [user]);

  const fetchReservations = async () => {
    setResLoading(true);
    try {
      const res = await getAllReservations();
      setReservations(res);
    } catch (err) {
      console.error(err);
    } finally {
      setResLoading(false);
    }
  };

  const fetchTables = async () => {
    setTablesLoading(true);
    try {
      const res = await getTables();
      setTables(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTablesLoading(false);
    }
  };

  const handleCancelClick = (r) => {
    setCancellingRes(r);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelReservation(cancellingRes._id);
      setShowCancelModal(false);
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const getTableObject = (r) => {
    if (!r?.tableId) return null;
    if (typeof r.tableId === 'object') return r.tableId;
    return tables.find(t => t._id === r.tableId) || null;
  };

  const getTableLabel = (r) => {
    const table = getTableObject(r);
    if (!table) return '—';
    const name = table.name || (table.tableNumber ? `Table #${table.tableNumber}` : 'Table');
    const cap = table.capacity ? ` (${table.capacity} seats)` : '';
    return `${name}${cap}`;
  };

  const getUserName = (r) => {
    return r.userName || 'Guest';
  };

  const matchesSearch = (r) => {
    const q = searchTerm.toLowerCase();
    const userName = getUserName(r).toLowerCase();
    if (userName.includes(q)) return true;
    if (r.date?.toLowerCase().includes(q)) return true;
    const table = getTableObject(r);
    if (table && (String(table.tableNumber || '').includes(searchTerm) || (table.name && table.name.toLowerCase().includes(q)) || String(table.capacity || '').includes(searchTerm))) return true;
    return false;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMe();
        if (res.role !== 'ADMIN') return;
        setUser(res);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
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
              All Reservations
            </h1>
            <p className="text-stone-500 dark:text-slate-400 text-base">
              View and manage all restaurant reservations.
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-between gap-4">
          <div>
            
            <p className="text-stone-500 dark:text-slate-400 text-base">View and manage all restaurant reservations.</p>
          </div>

          <div className="flex items-center gap-4 w-full max-w-2xl">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, date, or table..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />

            <div className="flex gap-3 items-center">
              <button onClick={() => setViewMode('grid')} title="Grid view" className={`px-3 py-1 rounded-xl transition ${viewMode === 'grid' ? 'bg-white/5 text-white shadow-sm' : 'border border-white/10 text-slate-100'}`}>
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button onClick={() => setViewMode('table')} title="Table view" className={`px-3 py-1 rounded-xl transition ${viewMode === 'table' ? 'bg-white/5 text-white shadow-sm' : 'border border-white/10 text-slate-100'}`}>
                <span className="material-symbols-outlined text-lg">table_restaurant</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {resLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20">
            <p className="mb-4 text-slate-300">No reservations found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {reservations.filter(matchesSearch).map(r => (
              <div key={r._id} className="p-3 rounded-2xl glass-panel text-slate-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition duration-150">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex-shrink-0 overflow-hidden flex items-center justify-center ring-1 ring-white/5">
                    <div className="text-white font-semibold">{getUserName(r)?.charAt?.(0) || '#'}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{getTableLabel(r)}</h3>
                    <p className="text-xs text-slate-400 truncate">{r.date} · {r.timeSlot}</p>
                    <p className="text-xs mt-1 text-slate-400">{getUserName(r)}</p>
                    <p className="text-xs mt-1 text-slate-400">Guests: {r.guests}</p>
                    <p className="text-xs mt-1 text-slate-400">Status: <span className="font-medium">{r.status}</span></p>
                  </div>

                  <div className="flex gap-2 ml-2">
                    
                    <button onClick={() => handleCancelClick(r)} title="Cancel" className="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-slate-300 hover:bg-white/5 shadow-sm hover:shadow-md">
                      <span className="material-symbols-outlined text-sm">cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto glass-panel p-6 rounded-2xl shadow-sm">
            <table className="w-full min-w-[700px] divide-y divide-white/10">
              <thead className="bg-white/10 text-slate-300 text-left">
                <tr>
                  <th className="py-4 px-6 font-semibold">#</th>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Date / Time</th>
                  <th className="py-4 px-6 font-semibold">Table</th>
                  <th className="py-4 px-6 font-semibold">Guests</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-100">
                {reservations.filter(matchesSearch).map((r, idx) => (
                  <tr key={r._id} className={`hover:bg-white/5 ${idx % 2 === 0 ? 'bg-white/5' : ''}`}>
                    <td className="py-4 px-6 border-r border-white/5">{idx + 1}</td>
                    <td className="py-4 px-6 border-r border-white/5">{getUserName(r)}</td>
                    <td className="py-4 px-6 border-r border-white/5">{r.date} · {r.timeSlot}</td>
                    <td className="py-4 px-6 border-r border-white/5">{getTableLabel(r)}</td>
                    <td className="py-4 px-6 border-r border-white/5">{r.guests}</td>
                    <td className="py-4 px-6 border-r border-white/5">{r.status}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button onClick={() => handleCancelClick(r)} title="Cancel" className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 shadow-sm hover:shadow-md transition-all">
                          <span className="material-symbols-outlined text-sm">cancel</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CANCEL MODAL */}
        {showCancelModal && (
          <Modal onClose={() => setShowCancelModal(false)}>
            <p className="mb-6 text-slate-100">Cancel reservation for <span className="font-semibold">{getUserName(cancellingRes)}</span> on <span className="font-semibold">{cancellingRes?.date}</span>?</p>

            <div className="flex gap-3">
              <button onClick={confirmCancel} className="px-4 py-2 rounded border border-white/10 text-slate-100 bg-white/5 hover:bg-white/10">Cancel reservation</button>
              <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 rounded border border-white/10 text-slate-100">Close</button>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

/* ---------------- MODAL ---------------- */
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="glass-panel rounded-2xl p-4 w-full max-w-md max-h-[80vh] overflow-auto relative border border-white/10 bg-white/5 text-slate-100 shadow-lg">
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-300 hover:text-white">✕</button>
      {children}
    </div>
  </div>
);

export default AllReservations;
