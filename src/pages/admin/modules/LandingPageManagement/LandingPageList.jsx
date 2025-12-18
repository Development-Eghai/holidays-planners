import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Eye, Edit, Trash2, Copy, MoreVertical, 
  Search, Star, ExternalLink, BarChart, LayoutGrid, List
} from 'lucide-react';

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';

// --- ENHANCED HELPER: Recursively remove IDs, timestamps, and read-only fields ---
const cleanDataForDuplication = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => cleanDataForDuplication(item));
  }
  if (data !== null && typeof data === 'object') {
    // List of fields to remove (expand this based on your API requirements)
    const fieldsToRemove = [
      'id', '_id', 'uuid', 
      'created_at', 'updated_at', 'deleted_at',
      'views', 'leads',
      'created_by', 'updated_by',
      'page_id', 'landing_page_id' // Remove any foreign key references
    ];
    
    const cleaned = {};
    for (const key in data) {
      // Skip if key is in removal list
      if (fieldsToRemove.includes(key)) {
        continue;
      }
      // Skip if value is null or undefined
      if (data[key] === null || data[key] === undefined) {
        continue;
      }
      // Recursively clean nested objects
      cleaned[key] = cleanDataForDuplication(data[key]);
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

  useEffect(() => {
    fetchLandingPages();
  }, []);

  // Close dropdown when clicking outside
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
      const response = await fetch(`${API_BASE_URL}/landing-pages?per_page=100`, {
        headers: { 'x-api-key': API_KEY }
      });
      
      if (!response.ok) throw new Error('Failed to fetch landing pages');
      
      const data = await response.json();
      setLandingPages(data.pages || data.data || data);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      alert('Failed to load landing pages');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter pages
  const filteredPages = landingPages.filter(page => {
    const matchesSearch = page.page_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && page.is_active) ||
                          (filterStatus === 'inactive' && !page.is_active);
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: landingPages.length,
    active: landingPages.filter(p => p.is_active).length,
    views: landingPages.reduce((sum, p) => sum + (p.views || 0), 0),
    leads: landingPages.reduce((sum, p) => sum + (p.leads || 0), 0)
  };

  const handleCreate = () => {
    navigate('/admin/dashboard/landing-pages/create');
  };

  const handleEdit = (id) => {
    navigate(`/admin/dashboard/landing-pages/edit/${id}`);
  };

  const handleView = (slug) => {
    window.open(`/landing/${slug}`, '_blank');
  };

const handleDuplicate = async (page) => {
  setIsLoading(true);
  setDropdownOpen(null);

  try {
    // ---------------------------------------------
    // 1. Fetch FULL landing page data (IMPORTANT)
    // ---------------------------------------------
    const detailResponse = await fetch(
      `${API_BASE_URL}/landing-pages/${page.id}`,
      {
        headers: {
          'x-api-key': API_KEY
        }
      }
    );

    if (!detailResponse.ok) {
      throw new Error('Failed to fetch full landing page data');
    }

    const fullPage = await detailResponse.json();
    console.log('Full page data:', fullPage);

    // ---------------------------------------------
    // 2. Clean data (remove IDs, timestamps, stats)
    // ---------------------------------------------
    const cleanedData = cleanDataForDuplication(fullPage);

    // ---------------------------------------------
    // 3. Generate unique slug
    // ---------------------------------------------
    const timestamp = Date.now();
    const baseSlug = (fullPage.slug || 'page').substring(0, 100);
    const uniqueSlug = `${baseSlug}-copy-${timestamp}`;

    // ---------------------------------------------
    // 4. Build final payload (FULL schema preserved)
    // ---------------------------------------------
    const duplicatePayload = {
      ...cleanedData,
      page_name: `${fullPage.page_name} (Copy)`,
      slug: uniqueSlug,
      is_active: false,
      is_default: false
    };

    console.log(
      'Final duplication payload:',
      JSON.stringify(duplicatePayload, null, 2)
    );

    // ---------------------------------------------
    // 5. Create duplicated landing page
    // ---------------------------------------------
    const createResponse = await fetch(
      `${API_BASE_URL}/landing-pages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(duplicatePayload)
      }
    );

    if (!createResponse.ok) {
      const errorData = await createResponse.json();

      let errorMessage = 'Failed to duplicate landing page';

      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map(err => {
              const path = err.loc?.join(' → ') || 'field';
              return `${path}: ${err.msg}`;
            })
            .join('\n');
        } else {
          errorMessage = errorData.detail;
        }
      }

      throw new Error(errorMessage);
    }

    await createResponse.json();

    alert('✅ Landing page duplicated successfully!');
    await fetchLandingPages();

  } catch (error) {
    console.error('Duplication error:', error);
    alert(
      `❌ Duplication failed\n\n${error.message}\n\nCheck console for details.`
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleSetDefault = async (id) => {
    setIsLoading(true);
    try {
      // First, remove default from all pages
      for (const page of landingPages) {
        if (page.is_default && page.id !== id) {
          await fetch(`${API_BASE_URL}/landing-pages/${page.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': API_KEY
            },
            body: JSON.stringify({ ...page, is_default: false })
          });
        }
      }
      
      // Set the new default
      const targetPage = landingPages.find(p => p.id === id);
      if (targetPage) {
        await fetch(`${API_BASE_URL}/landing-pages/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ ...targetPage, is_default: true })
        });
      }
      
      alert('✅ Set as default page!');
      await fetchLandingPages();
    } catch (error) {
      console.error('Set default error:', error);
      alert('❌ Failed to set default');
    } finally {
      setIsLoading(false);
      setDropdownOpen(null);
    }
  };

  const handleToggleStatus = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages/${page.id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      if (!response.ok) throw new Error('Failed to toggle status');
      
      alert(`✅ Page ${!page.is_active ? 'activated' : 'deactivated'} successfully!`);
      await fetchLandingPages();
    } catch (error) {
      console.error('Toggle error:', error);
      alert('❌ Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this landing page?\n\nThis action cannot be undone.')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      alert('✅ Page deleted successfully!');
      await fetchLandingPages();
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete page');
    } finally {
      setIsLoading(false);
      setDropdownOpen(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPreviewImage = (page) => {
    if (page.hero?.background_images && page.hero.background_images.length > 0) {
      return page.hero.background_images[0];
    }
    if (page.gallery?.images && page.gallery.images.length > 0) {
      return page.gallery.images[0];
    }
    return 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80';
  };

  if (isLoading && landingPages.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-slate-500 mt-4">Loading landing pages...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Loading Overlay */}
      {isLoading && landingPages.length > 0 && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Processing...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Landing Pages</h1>
          <p className="text-slate-500 mt-1">Manage your landing page templates</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Page
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Pages</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Views</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.views.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Leads</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.leads}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search landing pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  filterStatus === status 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredPages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No landing pages found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Try a different search term' : 'Get started by creating your first landing page'}
            </p>
            <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Create Landing Page
            </button>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* --- LIST VIEW --- */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">S.No</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPages.map((page, index) => (
                  <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{page.page_name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">/{page.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {page.views || 0}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {page.leads || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={page.is_active}
                            onChange={() => handleToggleStatus(page)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className={`text-xs px-2 py-1 rounded-full ${page.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {page.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(page.id)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDuplicate(page)} className="text-purple-600 hover:bg-purple-50 p-1.5 rounded transition-colors" title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleView(page.slug)} className="text-green-600 hover:bg-green-50 p-1.5 rounded transition-colors" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* --- CARD GRID VIEW --- */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div key={page.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow relative">
              
              {/* Image Section */}
              <div className="relative h-48 bg-slate-100 group rounded-t-lg overflow-hidden">
                <img
                  src={getPreviewImage(page)}
                  alt={page.page_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2 z-20">
                  <span className={`px-2 py-1 text-xs rounded-full shadow-sm backdrop-blur-md ${
                    page.is_active ? 'bg-green-500/90 text-white' : 'bg-slate-500/90 text-white'
                  }`}>
                    {page.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {page.is_default && (
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-500/90 text-white flex items-center gap-1 shadow-sm backdrop-blur-md">
                      <Star className="w-3 h-3" />
                      Default
                    </span>
                  )}
                </div>

                {/* Delete Icon (Top Right) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(page.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur text-red-600 rounded-full shadow-md hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-20 transform scale-90 hover:scale-100"
                  title="Delete Landing Page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                  <button
                    onClick={() => handleView(page.slug)}
                    className="bg-white text-slate-900 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 shadow-lg hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleEdit(page.id)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">
                      {page.page_name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">/{page.slug}</p>
                  </div>
                  
                  {/* Dropdown Menu Container */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(dropdownOpen === page.id ? null : page.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${dropdownOpen === page.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {dropdownOpen === page.id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                        <button
                          onClick={() => handleView(page.slug)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                          Open in New Tab
                        </button>
                        <button
                          onClick={() => handleEdit(page.id)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700"
                        >
                          <Edit className="w-4 h-4 text-slate-400" />
                          Edit Page
                        </button>
                        <button
                          onClick={() => handleDuplicate(page)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700"
                        >
                          <Copy className="w-4 h-4 text-slate-400" />
                          Duplicate
                        </button>
                        {!page.is_default && (
                          <button
                            onClick={() => handleSetDefault(page.id)}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700"
                          >
                            <Star className="w-4 h-4 text-slate-400" />
                            Set as Default
                          </button>
                        )}
                        
                        <div className="h-px bg-slate-100 my-1"></div>
                        
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Permanently
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{(page.views || 0).toLocaleString()}</span>
                    <span className="text-slate-400">views</span>
                  </div>
                  <div className="w-px h-3 bg-slate-300"></div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{page.leads || 0}</span>
                    <span className="text-slate-400">leads</span>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={page.is_active}
                        onChange={() => handleToggleStatus(page)}
                        disabled={isLoading}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className={`text-sm font-medium ${page.is_active ? 'text-green-600' : 'text-slate-500'}`}>
                      {page.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Updated {formatDate(page.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}