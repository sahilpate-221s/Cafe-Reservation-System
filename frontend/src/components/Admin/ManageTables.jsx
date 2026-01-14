import React, { useState, useEffect } from 'react';
import { getMe, getTables, createTable, updateTable, deleteTable } from '../../services/apiService';
import AdminLayout from './AdminLayout';

const ManageTables = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingTable, setEditingTable] = useState(null);
  const [deletingTable, setDeletingTable] = useState(null);

  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    name: '',
    location: '',
    view: '',
    image: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMe();
        if (res.role === 'ADMIN') setUser(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) fetchTables();
  }, [user]);

  /* ---------------- DATA ---------------- */
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

  /* ---------------- FORM ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.tableNumber) errors.tableNumber = 'Required';
    if (!formData.capacity || formData.capacity < 1) errors.capacity = 'Invalid';
    if (!formData.name) errors.name = 'Required';
    if (!formData.location) errors.location = 'Required';
    if (!formData.view) errors.view = 'Required';
    if (!formData.image) errors.image = 'Required';
    return errors;
  };

  const handleAddTable = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) return setFormErrors(errors);

    setSubmitLoading(true);
    try {
      await createTable(formData);
      setShowAddModal(false);
      resetForm();
      fetchTables();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setFormData({ ...table });
    setShowEditModal(true);
  };

  const handleUpdateTable = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) return setFormErrors(errors);

    setSubmitLoading(true);
    try {
      await updateTable(editingTable._id, formData);
      setShowEditModal(false);
      resetForm();
      fetchTables();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteTable = (table) => {
    setDeletingTable(table);
    setShowDeleteModal(true);
  };

  const confirmDeleteTable = async () => {
    try {
      await deleteTable(deletingTable._id);
      setShowDeleteModal(false);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      capacity: '',
      name: '',
      location: '',
      view: '',
      image: ''
    });
    setEditingTable(null);
  };

  const filteredTables = tables.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tableNumber.toString().includes(searchTerm)
  );



  /* ---------------- RENDER ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminLayout>
      <div className="relative z-10 max-w-[1280px] mx-auto p-6 lg:p-10 flex flex-col gap-10 bg-[#15171a] min-h-screen">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
              Manage Tables
            </h1>
            <p className="text-stone-500 dark:text-slate-400 text-base">
              Add, edit, and manage restaurant  tables.
            </p>
          </div>
        </div>

      <div className="flex items-center justify-between mb-8">
        
        <div>
          <p className="text-stone-500 dark:text-slate-400 text-base">Create, edit and manage seating</p>
        </div>

        <div className="flex items-center gap-4 w-full max-w-2xl">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tables..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />

          <div className="flex gap-3 items-center">
            <button
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              title="Grid view"
              className={`px-3 py-1 rounded-xl transition flex items-center justify-center ${viewMode === 'grid' ? 'bg-white/5 text-white shadow-sm' : 'border border-white/10 text-slate-100'}`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              title="Table view"
              className={`px-3 py-1 rounded-xl transition flex items-center justify-center ${viewMode === 'table' ? 'bg-white/5 text-white shadow-sm' : 'border border-white/10 text-slate-100'}`}
            >
              <span className="material-symbols-outlined text-lg">table_restaurant</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              title="Add table"
            >
              <span className="material-symbols-outlined align-middle">add</span>
            </button>
          </div>    
        </div>
      </div>    

      {/* CONTENT */}
      {tablesLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="text-center py-20">
          <p className="mb-4 text-slate-300">No tables found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            Add First Table
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTables.map(t => (
            <div key={t._id} className="p-3 rounded-2xl glass-panel text-slate-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition duration-150">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex-shrink-0 overflow-hidden flex items-center justify-center ring-1 ring-white/5">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white font-semibold">#{t.tableNumber}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{t.name}</h3>
                  <p className="text-xs text-slate-400 truncate">{t.capacity} seats · {t.view}</p>
                  <p className="text-xs mt-1 text-slate-400 truncate">{t.location}</p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button onClick={() => handleEditTable(t)} title="Edit" className="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-slate-100 hover:bg-white/5 shadow-sm hover:shadow-md">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => handleDeleteTable(t)} title="Delete" className="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-slate-300 hover:bg-white/5 shadow-sm hover:shadow-md">
                    <span className="material-symbols-outlined text-sm">delete</span>
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
                <th className="py-4 px-6 font-semibold">Name</th>
                <th className="py-4 px-6 font-semibold">Capacity</th>
                <th className="py-4 px-6 font-semibold">Location</th>
                <th className="py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-100">
              {filteredTables.map((t, index) => (
                <tr key={t._id} className={`hover:bg-white/5 ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <td className="py-4 px-6 border-r border-white/5">{t.tableNumber}</td>
                  <td className="py-4 px-6 border-r border-white/5">{t.name}</td>
                  <td className="py-4 px-6 border-r border-white/5">{t.capacity}</td>
                  <td className="py-4 px-6 border-r border-white/5">{t.location}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button onClick={() => handleEditTable(t)} title="Edit" className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-slate-100 hover:bg-white/10 shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDeleteTable(t)} title="Delete" className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <Modal onClose={() => { setShowAddModal(false); setShowEditModal(false); }}>
              <h2 className="text-lg font-bold mb-3">{showAddModal ? 'Add Table' : 'Edit Table'}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Table Number</label>
              <input
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleInputChange}
                type="number"
                min={0}
                placeholder="Table Number"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.tableNumber && <p className="text-xs text-red-400 mt-1">{formErrors.tableNumber}</p>}
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Capacity</label>
              <input
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                type="number"
                min={1}
                placeholder="Capacity"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.capacity && <p className="text-xs text-red-400 mt-1">{formErrors.capacity}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-300 mb-1">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                placeholder="Name"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                type="text"
                placeholder="Location"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.location && <p className="text-xs text-red-400 mt-1">{formErrors.location}</p>}
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">View</label>
              <input
                name="view"
                value={formData.view}
                onChange={handleInputChange}
                type="text"
                placeholder="View"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.view && <p className="text-xs text-red-400 mt-1">{formErrors.view}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-300 mb-1">Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                type="text"
                placeholder="Image URL"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.image && <p className="text-xs text-red-400 mt-1">{formErrors.image}</p>}
            </div>
          </div>

          <div className="flex gap-2 items-center justify-end">
            <button
              onClick={showAddModal ? handleAddTable : handleUpdateTable}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              {submitLoading ? 'Saving...' : (showAddModal ? 'Add' : 'Update')}
            </button>
            <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="px-3 py-1 rounded-md border border-white/10 text-slate-100 text-sm">Cancel</button>
          </div>
        </Modal>
      )}    

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <p className="mb-6 text-slate-100">Delete <span className="font-semibold">{deletingTable?.name}</span>?</p>

          <div className="flex gap-3">
            <button onClick={confirmDeleteTable} className="px-4 py-2 rounded border border-white/10 text-slate-100 bg-white/5 hover:bg-white/10">Delete</button>
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded border border-white/10 text-slate-100">Cancel</button>
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
    <div className="glass-panel rounded-2xl p-6 w-full max-w-lg relative border border-white/10 bg-white/5 text-slate-100">
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-300 hover:text-white">✕</button>
      {children}
    </div>
  </div>
);

export default ManageTables;
