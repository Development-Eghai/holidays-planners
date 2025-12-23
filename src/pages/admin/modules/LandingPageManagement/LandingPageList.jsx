import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Eye, Edit, Trash2, Copy, MoreVertical, 
  Search, Star, ExternalLink, BarChart, LayoutGrid, List
} from 'lucide-react';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';

const cleanDataForDuplication = (data) => {
  if (Array.isArray(data)) return data.map(cleanDataForDuplication);
  if (data !== null && typeof data === 'object') {
    const fieldsToRemove = ['id', '_id', 'uuid', 'created_at', 'updated_at', 'deleted_at', 'views', 'leads', 'created_by', 'updated_by', 'page_id', 'landing_page_id'];
    const cleaned = {};
    for (const key in data) {
      if (!fieldsToRemove.includes(key) && data[key] !== null && data[key] !== undefined) {
        cleaned[key] = cleanDataForDuplication(data[key]);
      }
    }
    return cleaned;
  }
  return data;
};

export default function LandingPageList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [landingPages, setLandingPages] = useState([]);

  useEffect(() => { fetchLandingPages(); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const fetchLandingPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages?per_page=100`, { headers: { 'x-api-key': API_KEY } });
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      setLandingPages(data.pages || data.data || data);
    } catch (error) { console.error(error); alert('Failed to load landing pages'); }
    finally { setIsLoading(false); }
  };

  const filteredPages = landingPages.filter(page => {
    const matchesSearch = page.page_name?.toLowerCase().includes(searchQuery.toLowerCase()) || page.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (filterStatus === 'active' && page.is_active) || (filterStatus === 'inactive' && !page.is_active);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: landingPages.length,
    active: landingPages.filter(p => p.is_active).length,
    views: landingPages.reduce((sum, p) => sum + (p.views || 0), 0),
    leads: landingPages.reduce((sum, p) => sum + (p.leads || 0), 0)
  };

  const handleCreate = () => navigate('/admin/dashboard/landing-pages/create');
  const handleEdit = (id) => navigate(`/admin/dashboard/landing-pages/edit/${id}`);

  // *** FIXED: Opens public route /landing/:slug which renders the appropriate template ***
  const handleView = (page) => {
    // Open the public landing page route
    // The LandingPageRenderer in App.jsx will handle template selection based on the data
    window.open(`/landing/${page.slug}`, '_blank');
  };

  const handleDuplicate = async (page) => {
    if(!window.confirm(`Duplicate "${page.page_name}"?`)) return;
    setIsLoading(true); setDropdownOpen(null);
    try {
      const detailRes = await fetch(`${API_BASE_URL}/landing-pages/${page.id}`, { headers: { 'x-api-key': API_KEY } });
      const fullPage = await detailRes.json();
      const cleanedData = cleanDataForDuplication(fullPage.data || fullPage);
      
      const payload = {
        ...cleanedData,
        page_name: `${fullPage.page_name || page.page_name} (Copy)`,
        slug: `${(fullPage.slug || page.slug).substring(0, 50)}-copy-${Date.now()}`,
        is_active: false,
        is_default: false
      };

      const createRes = await fetch(`${API_BASE_URL}/landing-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(payload)
      });
      if(!createRes.ok) throw new Error('Duplication failed');
      
      alert('✅ Page duplicated!');
      fetchLandingPages();
    } catch (error) { alert('Duplication failed: ' + error.message); }
    finally { setIsLoading(false); }
  };

  const handleToggleStatus = async (page) => {
    try {
      await fetch(`${API_BASE_URL}/landing-pages/${page.id}/toggle-active`, { method: 'PATCH', headers: { 'x-api-key': API_KEY } });
      setLandingPages(prev => prev.map(p => p.id === page.id ? { ...p, is_active: !p.is_active } : p));
    } catch (e) { alert('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await fetch(`${API_BASE_URL}/landing-pages/${id}`, { method: 'DELETE', headers: { 'x-api-key': API_KEY } });
      setLandingPages(prev => prev.filter(p => p.id !== id));
      alert('✅ Deleted successfully');
    } catch (e) { alert('Delete failed'); }
  };

  const getPreviewImage = (page) => {
    if (page.hero?.background_images?.length) return page.hero.background_images[0];
    if (page.gallery?.images?.length) return page.gallery.images[0];
    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  const getTemplateLabel = (t) => t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Minimal';

  if (isLoading && landingPages.length === 0) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-bold text-slate-900">Landing Pages</h1><p className="text-slate-500">Manage your marketing campaigns</p></div>
        <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> Create New Page</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center"><div><p className="text-sm text-slate-500">Total Pages</p><p className="text-3xl font-bold">{stats.total}</p></div><BarChart className="text-blue-600 opacity-20 w-10 h-10"/></div>
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center"><div><p className="text-sm text-slate-500">Active</p><p className="text-3xl font-bold text-green-600">{stats.active}</p></div><Eye className="text-green-600 opacity-20 w-10 h-10"/></div>
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center"><div><p className="text-sm text-slate-500">Total Views</p><p className="text-3xl font-bold text-purple-600">{stats.views}</p></div><Eye className="text-purple-600 opacity-20 w-10 h-10"/></div>
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center"><div><p className="text-sm text-slate-500">Leads</p><p className="text-3xl font-bold text-orange-600">{stats.leads}</p></div><Star className="text-orange-600 opacity-20 w-10 h-10"/></div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Search pages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {['all', 'active', 'inactive'].map(s => <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize ${filterStatus === s ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}>{s}</button>)}
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
             <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><LayoutGrid className="w-5 h-5"/></button>
             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map(page => (
            <div key={page.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-all group overflow-hidden border border-slate-100">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img src={getPreviewImage(page)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full text-white backdrop-blur-md ${page.is_active ? 'bg-green-500/90' : 'bg-slate-500/90'}`}>{page.is_active ? 'Active' : 'Inactive'}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500/90 text-white backdrop-blur-md">{getTemplateLabel(page.template)}</span>
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleView(page)} className="bg-white text-black p-2 rounded-lg hover:bg-slate-200"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => handleEdit(page.id)} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"><Edit className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 truncate">{page.page_name}</h3>
                    <p className="text-xs text-slate-500">/{page.slug}</p>
                  </div>
                  <div className="relative dropdown-container">
                    <button onClick={() => setDropdownOpen(dropdownOpen === page.id ? null : page.id)} className="p-1 hover:bg-slate-100 rounded"><MoreVertical className="w-4 h-4"/></button>
                    {dropdownOpen === page.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border py-1 z-10">
                        <button onClick={() => handleDuplicate(page)} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex gap-2 text-sm"><Copy className="w-4 h-4"/> Duplicate</button>
                        <button onClick={() => handleDelete(page.id)} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex gap-2 text-sm"><Trash2 className="w-4 h-4"/> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 pt-3 border-t">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {page.views || 0}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3"/> {page.leads || 0}</span>
                  <span className="ml-auto">{new Date(page.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Page Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Template</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stats</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPages.map(page => (
                <tr key={page.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{page.page_name}</p>
                    <p className="text-xs text-slate-500">/{page.slug}</p>
                  </td>
                  <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{getTemplateLabel(page.template)}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-600">{page.views || 0} Views</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleStatus(page)} className={`px-2 py-1 rounded-full text-xs font-bold ${page.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {page.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleView(page)} title="View" className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><Eye className="w-4 h-4"/></button>
                    <button onClick={() => handleEdit(page.id)} title="Edit" className="p-1.5 hover:bg-blue-100 rounded text-blue-600"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(page.id)} title="Delete" className="p-1.5 hover:bg-red-100 rounded text-red-600"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}