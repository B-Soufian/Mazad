import React, { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { Layers, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Modal state
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = new, object = edit

  // Form state
  const [formName, setFormName]         = useState('');
  const [formDesc, setFormDesc]         = useState('');
  const [formError, setFormError]       = useState('');
  const [formLoading, setFormLoading]   = useState(false);

  // Delete confirm state
  const [deleteId, setDeleteId]         = useState(null);

  // ---------- Fetch ----------
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // ---------- Open modal helpers ----------
  const openCreate = () => {
    setEditTarget(null);
    setFormName('');
    setFormDesc('');
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditTarget(cat);
    setFormName(cat.name);
    setFormDesc(cat.description || '');
    setFormError('');
    setShowModal(true);
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) { setFormError('Name is required.'); return; }
    try {
      setFormLoading(true);
      setFormError('');
      if (editTarget) {
        await axiosClient.put(`/categories/${editTarget.id}`, { name: formName, description: formDesc });
      } else {
        await axiosClient.post('/categories', { name: formName, description: formDesc });
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setFormLoading(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/categories/${id}`);
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete category.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 mt-2">Manage vehicle and asset categories for auctions.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#d71939] hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-5">Description</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No categories yet. Add one!</div>
          ) : (
            categories.map((cat, index) => (
              <div key={cat.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                {/* Index */}
                <div className="col-span-1 text-gray-400 font-bold text-sm">{index + 1}</div>

                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                    <Layers size={16} className="text-[#d71939]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{cat.name}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{cat.slug}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-5 text-gray-500 text-sm truncate">
                  {cat.description || <span className="text-gray-300 italic">No description</span>}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editTarget ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Luxury Cars"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows="3"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Short description (optional)..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600 font-medium">{formError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-[#d71939] hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  <Check size={16} />
                  {formLoading ? 'Saving...' : editTarget ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Category?</h2>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. All assets in this category may be affected.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
