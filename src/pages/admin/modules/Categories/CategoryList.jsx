import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Pencil, Trash2, Copy, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import CreateCategory from './CreateCategory'; 
import axios from 'axios'; 
import "../../css/Categories/CategoryList.css"; 

// --- API Configuration ---
const API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ"; 
const CATEGORY_API_URL = "https://api.yaadigo.com/secure/api/categories/";
const UPLOAD_URL = "https://api.yaadigo.com/multiple"; 
const BACKEND_DOMAIN = "https://api.yaadigo.com/uploads"; 
const errorMsg = console.error;
const successMsg = console.log;

// ⚠️ ACTION REQUIRED: Update this constant with your correct public-facing website URL
const PUBLIC_DOMAIN = "http://localhost:5173"; 

// --- Alert Component ---
const Alert = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white flex items-center z-50 transition-opacity duration-300";
    const typeStyle = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const Icon = type === 'success' ? CheckCircle : AlertTriangle;

    return (
        <div className={`${baseStyle} ${typeStyle}`}>
            <Icon size={20} className="mr-2" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
                <X size={16} />
            </button>
        </div>
    );
};
// --- End Alert Component ---


export default function CategoryList() {
    const [categories, setCategories] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryData, setCategoryData] = useState({});
    const [validation, setValidation] = useState({});
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]); 
    const [alert, setAlert] = useState(null); 

    // --- Helpers ---

    const showAlert = useCallback((message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 4000); // Hide after 4 seconds
    }, []);

    const getFullImageUrl = (path) => {
        if (!path || typeof path !== 'string') return '';
        return path.startsWith('http') ? path : `${BACKEND_DOMAIN}/${path}`;
    };

    const getRelativeImagePath = (url) => {
        if (!url || typeof url !== 'string') return '';
        return url.startsWith(BACKEND_DOMAIN) ? url.replace(`${BACKEND_DOMAIN}/`, '') : url;
    };

    const getCategoryId = (category) => category.id || category._id;

    // --- API & Core Functions ---

    const getAllTourCategory = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${CATEGORY_API_URL}?skip=0&limit=1000&tenant_id=2`, { 
                method: 'GET',
                headers: { 'accept': 'application/json', 'x-api-key': API_KEY, },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                const processedCategories = result.data.map((cat, index) => ({ 
                    ...cat, 
                    sno: index + 1,
                    image: cat.image ? cat.image.map(getFullImageUrl) : [],
                }));
                setCategories(processedCategories);
            } else { errorMsg("Failed to fetch categories:", result.message || 'API Key or URL issue.'); }
        } catch (error) { errorMsg("Network error while fetching categories:", error.message); } finally { setIsLoading(false); }
    };

    const handleFileUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("gallery_images", file); 
        formData.append("storage", "local");
        
        try {
            const uploadRes = await axios.post(UPLOAD_URL, formData, { headers: { "x-api-key": API_KEY, 'Content-Type': 'multipart/form-data', }, });
            const result = uploadRes.data;

            if (result?.message === "Files uploaded" && result.files) {
                const newPaths = Array.isArray(result.files) ? result.files.flat() : [result.files];
                setCategoryData(prev => ({
                    ...prev,
                    image: [...(prev?.image || []), ...newPaths.map(getFullImageUrl)], 
                }));
                e.target.value = null; 
            } else { 
                errorMsg(result.message || "File upload failed on server."); 
                showAlert(result.message || "File upload failed.", 'error');
            }
        } catch (error) { 
            errorMsg("File upload error. Check the UPLOAD_URL and API Key.", error?.response?.data || error); 
            showAlert("File upload failed due to network error.", 'error');
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setCategoryData(prev => ({ ...prev, image: prev.image.filter((_, index) => index !== indexToRemove) }));
    };
    
    const handleSubmit = async (e, dataWithTenant) => {
        const submissionData = { ...dataWithTenant, image: dataWithTenant.image.map(getRelativeImagePath) };
        try {
            const response = await axios.post(CATEGORY_API_URL, submissionData, { headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, }, });
            if (response.data.success) { 
                showAlert("Category created successfully!");
                getAllTourCategory(); 
            } else { 
                errorMsg(response.data.message || "Failed to create category."); 
                showAlert(response.data.message || "Failed to create category.", 'error');
            }
        } catch (error) { 
            errorMsg("Submission error.", error?.response?.data || error); 
            showAlert("Submission failed due to server error.", 'error');
        }
        setIsModalOpen(false); 
    };

    const handleUpdate = async (e, dataWithTenant) => {
        const categoryId = dataWithTenant?.id; 
        if (!categoryId) return errorMsg("Category ID is missing for update.");
        const submissionData = { ...dataWithTenant, image: dataWithTenant.image.map(getRelativeImagePath) };

        try {
            const response = await axios.put(`${CATEGORY_API_URL}${categoryId}`, submissionData, { headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, }, });
            if (response.data.success) { 
                showAlert("Category updated successfully!");
                getAllTourCategory(); 
            } else { 
                errorMsg(response.data.message || "Failed to update category."); 
                showAlert(response.data.message || "Failed to update category.", 'error');
            }
        } catch (error) { 
            errorMsg("Update error.", error?.response?.data || error); 
            showAlert("Update failed due to server error.", 'error');
        }
        setIsModalOpen(false); 
    };
    
    // --- Bulk Selection & Delete ---

    const handleSelectRow = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(categories.map(getCategoryId));
        } else {
            setSelectedIds([]);
        }
    };
    
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected categories?`)) return;

        setIsLoading(true);
        try {
            const deletePromises = selectedIds.map(id => 
                axios.delete(`${CATEGORY_API_URL}${id}?tenant_id=2`, { headers: { 'x-api-key': API_KEY } })
            );

            const results = await Promise.allSettled(deletePromises);
            
            const failedCount = results.filter(r => r.status === 'rejected' || !r.value?.data?.success).length;

            if (failedCount === 0) {
                 showAlert("All selected categories deleted successfully!");
            } else {
                 showAlert(`${selectedIds.length - failedCount} deleted. ${failedCount} failed to delete.`, 'error');
            }
            
            setSelectedIds([]);
            getAllTourCategory(); 
        } catch (error) {
            errorMsg("An error occurred during bulk deletion.");
            showAlert("An unexpected error occurred during bulk deletion.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Action Button Handlers ---
    const handleEdit = (category) => {
        setCategoryData({ ...category }); 
        setIsUpdate(true);
        setIsViewOnly(false);
        setValidation({});
        setIsModalOpen(true);
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        
        try {
            const response = await axios.delete(`${CATEGORY_API_URL}${categoryId}?tenant_id=2`, { 
                headers: { 'x-api-key': API_KEY, },
            });
            if (response.data.success) {
                showAlert("Category deleted successfully!");
                getAllTourCategory();
            } else { 
                errorMsg(response.data.message || "Failed to delete category."); 
                showAlert(response.data.message || "Failed to delete category.", 'error');
            }
        } catch (error) { 
            errorMsg("Delete error.", error?.response?.data || error); 
            showAlert("Delete failed due to server error.", 'error');
        }
    };

    const handleDuplicate = (category) => {
        // Deep clone to ensure independent state
        const deepClone = JSON.parse(JSON.stringify(category));
        const { id, _id, ...rest } = deepClone; 

        setCategoryData({ 
            ...rest, 
            name: `${category.name} (Copy)`, 
            slug: `${category.slug}-copy`, 
            tenant_id: 2, 
            isDuplicating: true, // Flag for modal title
        });

        setIsUpdate(false); 
        setIsViewOnly(false); 
        setValidation({}); 
        setIsModalOpen(true);
    };

    const handleView = (category) => {
        const id = getCategoryId(category);
        const slug = category.slug;
        
        // Open public preview page only
        if (slug && id) {
            const publicUrl = `${PUBLIC_DOMAIN}/category/${slug}/${id}`;
            window.open(publicUrl, '_blank');
        } else {
            successMsg("Could not generate public URL. Missing slug or ID.");
        }
    };

    // --- Setup and Render ---
    useEffect(() => {
        getAllTourCategory();
    }, []);

    const handleOpenCreateModal = () => {
        setCategoryData({ name: '', slug: '', description: '', image: [], tenant_id: 2, isDuplicating: false }); 
        setIsUpdate(false); setIsViewOnly(false); setValidation({}); setIsModalOpen(true);
    };

    const allSelected = categories.length > 0 && selectedIds.length === categories.length;

    return (
        <div className='category-list-main p-6'>
            {/* Render Alert/Toast */}
            <Alert 
                message={alert?.message} 
                type={alert?.type} 
                onClose={() => setAlert(null)} 
            />

            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-3xl font-bold'>Trip Category</h2> 
                
                <div className='flex items-center space-x-3'>
                    
                    {/* Delete Selected Button */}
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={handleBulkDelete} 
                            className='flex items-center px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-colors
                                     bg-red-600 hover:bg-red-700 disabled:bg-red-300' 
                            disabled={isLoading}
                        >
                            <Trash2 size={20} className='mr-2' /> Delete ({selectedIds.length}) Selected
                        </button>
                    )}
                    
                    {/* Add Category Button */}
                    <button 
                        onClick={handleOpenCreateModal} 
                       className='flex items-center px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-colors
             bg-green-600 hover:bg-green-700'
                    >
                        <Plus size={20} className='mr-2' /> Add Category
                    </button>
                </div>
            </div>
            
            {isLoading ? (<p className="text-center text-xl">Loading categories...</p>) : (
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 custom-table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left w-10">
                                    <input type="checkbox" checked={allSelected} onChange={handleSelectAll} className="form-checkbox" />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SNO</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => {
                                const id = getCategoryId(category);
                                return (
                                    <tr key={id}> 
                                        <td className="px-6 py-4 whitespace-nowrap w-10">
                                            <input type="checkbox" checked={selectedIds.includes(id)} onChange={() => handleSelectRow(id)} className="form-checkbox" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.sno}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2 action-icons">
                                                <button onClick={() => handleEdit(category)} title="Edit" className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></button>
                                                <button onClick={() => handleDelete(id)} title="Delete" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                                <button onClick={() => handleDuplicate(category)} title="Duplicate" className="text-purple-600 hover:text-purple-800"><Copy size={18} /></button>
                                                
                                                <button onClick={() => handleView(category)} title="Public Preview" className="text-green-600 hover:text-green-800">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            <div className="mt-4 flex justify-end items-center text-sm text-gray-700 pagination-controls">
                <span>Rows per page:</span>
                <select className="mx-2 p-1 border rounded custom-select"><option>10</option><option>25</option><option>50</option></select>
                <span>1-5 of 5</span> 
                <div className="flex ml-2 space-x-1 pagination-arrows">
                    <button className="p-1 border rounded pagination-arrow disabled">&lt;</button>
                    <button className="p-1 border rounded pagination-arrow disabled">&gt;</button>
                </div>
            </div>


            <CreateCategory
                open={isModalOpen}
                setOpen={setIsModalOpen}
                categoryData={categoryData}
                setcategoryData={setCategoryData}
                validation={validation}
                setValidation={setValidation}
                isViewOnly={isViewOnly}
                setIsViewOnly={setIsViewOnly}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
                handleSubmit={handleSubmit} 
                handleUpdate={handleUpdate}
                handleFileUpload={handleFileUpload}
                handleRemoveImage={handleRemoveImage}
                getAllTourCategory={getAllTourCategory} 
            />
        </div>
    );
}