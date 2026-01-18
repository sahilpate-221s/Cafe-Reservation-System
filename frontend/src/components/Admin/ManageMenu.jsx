import React, { useState, useEffect } from 'react';
import { getMe, getMenus, createMenu, updateMenu, deleteMenu } from '../../services/apiService';
import AdminLayout from './AdminLayout';

const ManageMenu = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Menu state
  const [menus, setMenus] = useState([]);
  const [menusLoading, setMenusLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingMenu, setEditingMenu] = useState(null);
  const [deletingMenu, setDeletingMenu] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    imageUrl: '',
    isAvailable: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

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

  useEffect(() => {
    if (user) fetchMenus();
  }, [user]);

  const fetchMenus = async () => {
    setMenusLoading(true);
    try {
      const res = await getMenus();
      // console.log('Fetched menus:', res);
      setMenus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setMenusLoading(false);
    }
  };

  /* ---------------- FORM ---------------- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Required';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Invalid';
    if (!formData.category) errors.category = 'Required';
    return errors;
  };

  const handleAddMenu = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) return setFormErrors(errors);

    setSubmitLoading(true);
    try {
      await createMenu(formData);
      setShowAddModal(false);
      resetForm();
      fetchMenus();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditMenu = (item) => {
    setEditingMenu(item);
    setFormData({ ...item });
    setShowEditModal(true);
  };

  const handleUpdateMenu = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) return setFormErrors(errors);

    setSubmitLoading(true);
    try {
      await updateMenu(editingMenu._id, formData);
      setShowEditModal(false);
      resetForm();
      fetchMenus();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteMenu = (item) => {
    setDeletingMenu(item);
    setShowDeleteModal(true);
  };

  const confirmDeleteMenu = async () => {
    try {
      await deleteMenu(deletingMenu._id);
      setShowDeleteModal(false);
      fetchMenus();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: '', description: '', imageUrl: '', isAvailable: true });
    setEditingMenu(null);
  };

  const filtered = menus.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              Manage Menu
            </h1>
            <p className="text-stone-500 dark:text-slate-400 text-base">
              Add, edit, and manage restaurant menu items.
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-between gap-4">
          <div>
             <p className="text-stone-500 dark:text-slate-400 text-base">Add, edit, and manage restaurant menu items.</p>
          </div>

          <div className="flex items-center gap-4 w-full max-w-2xl">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menu..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />

            <div className="flex gap-3 items-center">
              <button onClick={() => setViewMode('grid')} title="Grid view" className={`px-3 py-1 rounded-xl transition ${viewMode === 'grid' ? 'bg-white/5 text-white shadow-sm' : 'border border-white/10 text-slate-100'}`}>
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button onClick={() => setViewMode('table')} title="Table view" className={`px-3 py-1 rounded-xl transition ${viewMode === 'table' ? 'bg-white/5 text-white shadow-sm' : 'border border-white/10 text-slate-100'}`}>
                <span className="material-symbols-outlined text-lg">table_restaurant</span>
              </button>

              <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:shadow-md transition-shadow" title="Add item">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {menusLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="mb-4 text-slate-300">No menu items found</p>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:shadow-md">Add First Item</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div key={item._id} className="p-3 rounded-2xl glass-panel text-slate-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition duration-150">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/15 flex-shrink-0 overflow-hidden flex items-center justify-center ring-1 ring-white/5">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="text-white font-semibold">{item.name.charAt(0)}</div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-slate-400 truncate">{item.category} · ${item.price}</p>
                    <p className="text-xs mt-1 text-slate-400 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex gap-2 ml-2">
                    <button onClick={() => handleEditMenu(item)} title="Edit" className="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-slate-100 hover:bg-white/5 shadow-sm hover:shadow-md">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDeleteMenu(item)} title="Delete" className="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-slate-300 hover:bg-white/5 shadow-sm hover:shadow-md">
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
                  <th className="py-4 px-6 font-semibold">Name</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Price</th>
                  <th className="py-4 px-6 font-semibold">Available</th>
                  <th className="py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-100">
                {filtered.map((item, index) => (
                  <tr key={item._id} className={`hover:bg-white/5 ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                    <td className="py-4 px-6 border-r border-white/5">{item.name}</td>
                    <td className="py-4 px-6 border-r border-white/5">{item.category}</td>
                    <td className="py-4 px-6 border-r border-white/5">${item.price}</td>
                    <td className="py-4 px-6 border-r border-white/5">{item.isAvailable ? 'Yes' : 'No'}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditMenu(item)} title="Edit" className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-slate-100 hover:bg-white/10 shadow-sm hover:shadow-md transition-all">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onClick={() => handleDeleteMenu(item)} title="Delete" className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 shadow-sm hover:shadow-md transition-all">
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
          <Modal onClose={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
            <h2 className="text-lg font-bold mb-3">{showAddModal ? 'Add Menu Item' : 'Edit Menu Item'}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Name" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" />
                {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Price</label>
                <input name="price" value={formData.price} onChange={handleInputChange} type="number" min={0} step="0.01" placeholder="Price" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" />
                {formErrors.price && <p className="text-xs text-red-400 mt-1">{formErrors.price}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Category</label>
                <input name="category" value={formData.category} onChange={handleInputChange} type="text" placeholder="Category" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" />
                {formErrors.category && <p className="text-xs text-red-400 mt-1">{formErrors.category}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Available</label>
                <div className="flex items-center gap-3">
                  <input name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} type="checkbox" className="w-4 h-4" />
                  <span className="text-xs text-slate-300">Available for ordering</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Short description" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={3} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-300 mb-1">Image URL</label>
                <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} type="text" placeholder="Image URL" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div className="flex gap-2 items-center justify-end">
              <button onClick={showAddModal ? handleAddMenu : handleUpdateMenu} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm shadow-sm hover:shadow-md transition-shadow">{submitLoading ? 'Saving...' : (showAddModal ? 'Add' : 'Update')}</button>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="px-3 py-1 rounded-md border border-white/10 text-slate-100 text-sm">Cancel</button>
            </div>
          </Modal>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <p className="mb-6 text-slate-100">Delete <span className="font-semibold">{deletingMenu?.name}</span>?</p>

            <div className="flex gap-3">
              <button onClick={confirmDeleteMenu} className="px-4 py-2 rounded border border-white/10 text-slate-100 bg-white/5 hover:bg-white/10">Delete</button>
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
    <div className="glass-panel rounded-2xl p-4 w-full max-w-md max-h-[80vh] overflow-auto relative border border-white/10 bg-white/5 text-slate-100 shadow-lg">
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-300 hover:text-white">✕</button>
      {children}
    </div>
  </div>
);

export default ManageMenu;
