import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Eye, Edit, Trash2, Copy, MoreVertical, 
  Search, Star, ExternalLink, BarChart, LayoutGrid, List, AlertCircle
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
    } catch (error) { console.error(error); }
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

  // *** UPDATED: Preview logic with Warning for unpublished pages ***
  const handleView = async (page) => {
    if (!page.is_active) {
      const confirmPublish = window.confirm(
        `⚠️ This page is currently Inactive (Unpublished).\n\nTo preview this page, it must be set to Active. Would you like to publish it now to view the preview?`
      );
      
      if (confirmPublish) {
        setIsLoading(true);
        try {
          await handleToggleStatus(page);
          window.open(`/landing/${page.slug}`, '_blank');
        } catch (e) {
          alert("Failed to activate for preview.");
        } finally {
          setIsLoading(false);
        }
      }
      return;
    }
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
        slug: `${(fullPage.slug || page.slug).substring(0, 40)}-copy-${Math.floor(Math.random() * 1000)}`,
        is_active: false,
        is_default: false
      };

      const createRes = await fetch(`${API_BASE_URL}/landing-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(payload)
      });
      if(!createRes.ok) throw new Error('Duplication failed');
      
      fetchLandingPages();
    } catch (error) { alert('Duplication failed: ' + error.message); }
    finally { setIsLoading(false); }
  };

  const handleToggleStatus = async (page) => {
    try {
      const res = await fetch(`${API_BASE_URL}/landing-pages/${page.id}/toggle-active`, { 
        method: 'PATCH', 
        headers: { 'x-api-key': API_KEY } 
      });
      if (!res.ok) throw new Error();
      setLandingPages(prev => prev.map(p => p.id === page.id ? { ...p, is_active: !p.is_active } : p));
    } catch (e) { alert('Failed to update status'); throw e; }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await fetch(`${API_BASE_URL}/id/${id}`, { method: 'DELETE', headers: { 'x-api-key': API_KEY } });
      setLandingPages(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert('Delete failed'); }
  };

  const getPreviewImage = (page) => {
    if (page.hero?.background_images?.length) return page.hero.background_images[0];
    return 'https://via.placeholder.com/400x300?text=No+Preview';
  };

  if (isLoading && landingPages.length === 0) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-bold text-slate-900">Landing Pages</h1><p className="text-slate-500">Manage your marketing campaigns</p></div>
        <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> Create New Page</button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Pages', val: stats.total, icon: List, color: 'text-blue-600' },
          { label: 'Active', val: stats.active, icon: Eye, color: 'text-green-600' },
          { label: 'Views', val: stats.views, icon: BarChart, color: 'text-purple-600' },
          { label: 'Leads', val: stats.leads, icon: Star, color: 'text-orange-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p><p className="text-2xl font-bold text-slate-800">{s.val}</p></div>
            <s.icon className={`${s.color} opacity-20 w-8 h-8`}/>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Search pages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            {['all', 'active', 'inactive'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{s}</button>
            ))}
          </div>
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><LayoutGrid className="w-5 h-5"/></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><List className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map(page => (
            <div key={page.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all group border border-slate-200 relative">
              <div className="relative h-44 rounded-t-xl overflow-hidden bg-slate-100">
                <img src={getPreviewImage(page)} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-2 left-2 flex gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${page.is_active ? 'bg-green-500' : 'bg-slate-500'}`}>{page.is_active ? 'ACTIVE' : 'DRAFT'}</span>
                </div>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => handleView(page)} className="bg-white p-2 rounded-full hover:scale-110 transition-transform"><Eye className="w-5 h-5 text-slate-700"/></button>
                  <button onClick={() => handleEdit(page.id)} className="bg-blue-600 p-2 rounded-full hover:scale-110 transition-transform"><Edit className="w-5 h-5 text-white"/></button>
                </div>
              </div>

              <div className="p-4 relative">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate pr-4">{page.page_name}</h3>
                    <p className="text-xs text-slate-400 truncate tracking-tight">/landing/{page.slug}</p>
                  </div>
                  
                  {/* DROP_DOWN CONTAINER: Removed overflow-hidden from parent so this shows */}
                  <div className="relative dropdown-container">
                    <button 
                      onClick={() => setDropdownOpen(dropdownOpen === page.id ? null : page.id)} 
                      className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-slate-400"/>
                    </button>
                    {dropdownOpen === page.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-44 bg-white shadow-2xl rounded-xl border border-slate-100 py-1 z-[100] animate-in fade-in slide-in-from-bottom-2">
                        <button onClick={() => handleDuplicate(page)} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-700"><Copy className="w-4 h-4"/> Duplicate</button>
                        <hr className="my-1 border-slate-50" />
                        <button onClick={() => handleDelete(page.id)} className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 font-medium"><Trash2 className="w-4 h-4"/> Delete Page</button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 text-[10px] font-bold text-slate-400">
                   <div className="flex gap-3">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {page.views || 0}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3"/> {page.leads || 0}</span>
                   </div>
                   <span>UPDATED {new Date(page.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view code follows similar logic ... */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Page Information</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.map(page => (
                <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{page.page_name}</p>
                    <p className="text-xs text-slate-400">/{page.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 text-xs font-bold text-slate-500">
                      <span>{page.views || 0} Views</span>
                      <span>{page.leads || 0} Leads</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleStatus(page)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${page.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                      {page.is_active ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1 relative dropdown-container">
                      <button onClick={() => handleView(page)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100"><Eye className="w-4 h-4"/></button>
                      <button onClick={() => handleEdit(page.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => setDropdownOpen(dropdownOpen === page.id ? null : page.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 shadow-sm border border-transparent hover:border-slate-100"><MoreVertical className="w-4 h-4"/></button>
                      
                      {dropdownOpen === page.id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-2xl rounded-xl border border-slate-100 py-1 z-[100]">
                          <button onClick={() => handleDuplicate(page)} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-xs text-slate-600"><Copy className="w-3 h-3"/> Duplicate</button>
                          <button onClick={() => handleDelete(page.id)} className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-xs text-red-600"><Trash2 className="w-3 h-3"/> Delete</button>
                        </div>
                      )}
                    </div>
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