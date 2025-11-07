// src/modules/Destinations/DestinationList.jsx

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Copy, Eye } from 'lucide-react'; 
import axios from 'axios'; 

// --- MOCK/PLACEHOLDER IMPORTS (Retained for environment compatibility) ---
const CustomModal = ({ open, onClickOutside, children }) => { 
    if (!open) return null; 
    return (
        <div className="custom-modal-overlay" onClick={onClickOutside}>
            <div className="delete-model-view-main" onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    ); 
};
const APIBaseUrl = axios.create({ baseURL: "https://api.yaadigo.com/secure/api/" }); 
const capitalizeWords = (str) => str ? str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
const successMsg = console.log;
const errorMsg = console.error;
const MyDataTable = ({ rows, columns, isLoading, checkboxSelection, onRowSelectionModelChange, selectionModel, getRowId }) => {
    if (isLoading) return <p className="text-center text-xl mt-8">Loading data...</p>;
    if (rows.length === 0) return <p className="text-center text-xl mt-8">No destinations found.</p>;
    return <p className="text-center text-xl mt-8">Data table placeholder loaded with {rows.length} rows.</p>;
};
// --- END MOCK IMPORTS ---

// --- API Configuration (using verified key) ---
const DESTINATION_API_KEY = "x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ"; 


const DestinationList = () => {
    const [destinationList, setDestinationList] = useState([])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // State for bulk actions
    const [selectionModel, setSelectionModel] = useState([]);
    const [duplicateId, setDuplicateId] = useState("");
    const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);

    const navigate = useNavigate();

    // Helper to extract ID correctly (supports both 'id' and '_id')
    const getDestinationId = (destination) => destination.id || destination._id;


    const handlePreview = (slug, id) => {
        const url = `/destination/${slug}/${id}`;
        window.open(url, '_blank');
    };

    const handleUpdateNavigate = (_id) => {
        navigate(`/admin/dashboard/destination-create/${_id}`);
    }

    // Helper for generating unique slug
    const generateUniqueSlug = (originalSlug) => {
        // Normalize the slug, append a timestamp and '-copy'
        const baseSlug = (originalSlug || 'destination').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const timestamp = Date.now();
        return `${baseSlug}-copy-${timestamp}`;
    };

    // --- API FUNCTIONS ---
    
    // Function to fetch all destinations
    const getAllDestination = async () => {
        try {
            setIsLoading(true);
            const res = await APIBaseUrl.get("destinations/", {
                headers: { "x-api-key": DESTINATION_API_KEY, 'accept': 'application/json' },
            });
            if (res?.data?.success === true) {
                // Add SNO and normalize data structure
                const processedList = res?.data?.data.map((dest, index) => ({
                    ...dest,
                    sno: index + 1,
                    id: getDestinationId(dest),
                })) || [];
                setDestinationList(processedList);
                setIsLoading(false);
            } else {
                setDestinationList([]);
                setIsLoading(false);
            }
        } catch (error) {
            setDestinationList([]);
            setIsLoading(false);
            errorMsg("Failed to fetch destinations.", error);
        }
    }


    // Handles single item delete
    const handleSingleDelete = async () => {
        try {
            const res = await APIBaseUrl.delete(`destinations/${deleteId}`, {
                headers: { "x-api-key": DESTINATION_API_KEY },
            });
            if (res?.data?.success === true) {
                successMsg("Destination Deleted Successfully")
                setOpenDeleteModal(false)
                getAllDestination()
                setDeleteId('')
            }
        } catch (error) {
            console.error("Error deleting destination:", error?.response?.data || error.message);
            errorMsg("Failed to delete destination.");
        }
    }
    
    // Function to handle bulk delete for destinations
    const handleBulkDelete = async () => {
        if (selectionModel.length === 0) return;

        try {
            const deletePromises = selectionModel.map(id => 
                APIBaseUrl.delete(`destinations/${id}`, {
                    headers: { "x-api-key": DESTINATION_API_KEY },
                })
            );

            await Promise.allSettled(deletePromises);

            successMsg(`${selectionModel.length} destinations deleted successfully.`);
            setOpenDeleteModal(false);
            setSelectionModel([]); // Clear selection
            getAllDestination(); // Refresh the list
        } catch (error) {
            console.error("Error performing bulk delete:", error);
            errorMsg("An error occurred during bulk delete.");
            setOpenDeleteModal(false);
        }
    }

    // Determines whether to run single or bulk delete based on modal context
    const handleDelete = selectionModel.length > 0 && deleteId === null ? handleBulkDelete : handleSingleDelete;
    
    // Function to handle duplicate destination (WORKING AND FIXED IMPLEMENTATION)
    const handleDuplicateDestination = async () => {
        if (!duplicateId) return;

        setIsDuplicating(true);
        try {
            // 1. Fetch the original destination data
            const getRes = await APIBaseUrl.get(`destinations/${duplicateId}`, {
                headers: { "x-api-key": DESTINATION_API_KEY, 'accept': 'application/json' },
            });

            if (!getRes?.data?.success || !getRes?.data?.data) {
                throw new Error("Failed to fetch destination data for duplication.");
            }

            const originalData = getRes.data.data;

            // 2. Prepare data for the new destination (the copy)
            const newDestinationData = { ...originalData };

            // Remove unique identifiers and timestamps
            delete newDestinationData.id;
            delete newDestinationData._id;
            delete newDestinationData.created_at;
            delete newDestinationData.updated_at;

            // 3. Generate new, unique values
            newDestinationData.slug = generateUniqueSlug(originalData.slug || originalData.title);
            newDestinationData.title = `Copy of ${originalData.title}`;

            // 4. Transform Trip Data (Fixing Pydantic Validation Errors)

            // a. Handle popular_trip_ids
            if (originalData.popular_trips && Array.isArray(originalData.popular_trips)) {
                // Extract only the IDs from the nested objects
                newDestinationData.popular_trip_ids = originalData.popular_trips.map(trip => trip.id).filter(id => id != null);
            } else {
                newDestinationData.popular_trip_ids = []; 
            }
            // Delete the nested objects to prevent API conflict
            delete newDestinationData.popular_trips;

            // b. Handle custom_packages[i].trip_ids
            if (originalData.custom_packages && Array.isArray(originalData.custom_packages)) {
                newDestinationData.custom_packages = originalData.custom_packages.map(pkg => {
                    const newPkg = { ...pkg };

                    if (newPkg.trips && Array.isArray(newPkg.trips)) {
                        // Extract only the IDs from the nested trips within the package
                        newPkg.trip_ids = newPkg.trips.map(trip => trip.id).filter(id => id != null);
                    } else {
                        newPkg.trip_ids = [];
                    }
                    // Delete the nested 'trips' array of objects
                    delete newPkg.trips;
                    return newPkg;
                });
            } else {
                newDestinationData.custom_packages = [];
            }

            // c. Ensure other required ID arrays are present, even if empty/null
            newDestinationData.featured_blog_ids = originalData.featured_blog_ids || [];
            newDestinationData.related_blog_ids = originalData.related_blog_ids || [];
            newDestinationData.activity_ids = originalData.activity_ids || [];
            newDestinationData.testimonial_ids = originalData.testimonial_ids || [];
            newDestinationData.blog_category_ids = originalData.blog_category_ids || [];
            
            // 5. Post the new destination data to create a copy
            const postRes = await APIBaseUrl.post("destinations/", newDestinationData, {
                headers: { "x-api-key": DESTINATION_API_KEY, 'Content-Type': 'application/json' },
            });

            if (postRes?.data?.success === true) {
                successMsg("Destination Duplicated Successfully. A copy has been created.");
                setOpenDuplicateModal(false);
                setDuplicateId("");
                getAllDestination(); // Refresh the list
            } else {
                throw new Error(postRes?.data?.message || "Destination creation failed.");
            }
        } catch (error) {
            console.error("Error duplicating destination:", error?.response?.data || error.message);
            errorMsg("Failed to duplicate destination. Check console for details.");
        } finally {
            setIsDuplicating(false);
        }
    };
    
    // --- Selection Handlers ---
    const handleSelectRow = (id) => {
        setSelectionModel(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectionModel(destinationList.map(getDestinationId));
        } else {
            setSelectionModel([]);
        }
    };

    useEffect(() => {
        getAllDestination()
    }, [])

    const allSelected = destinationList.length > 0 && selectionModel.length === destinationList.length;

    return (
        <div className='admin-content-main p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-3xl font-bold'>Destination List</h3>
                <div className='flex items-center space-x-3'>
                    {/* Bulk Delete Button */}
                    {selectionModel.length > 0 && (
                        <button 
                            onClick={() => { setDeleteId(null); setOpenDeleteModal(true); }} // Set deleteId to null to signify bulk delete
                            className='flex items-center px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-colors
                                         bg-red-600 hover:bg-red-700 disabled:bg-red-300' 
                        >
                            <Trash2 size={20} className='mr-2' /> Delete ({selectionModel.length}) Selected
                        </button>
                    )}
                    <button 
                        className='flex items-center px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-colors
                                     bg-orange-600 hover:bg-orange-700' 
                        onClick={() => navigate("/admin/dashboard/destination-create")}
                    >
                        <Plus size={20} className='mr-2' /> Add Destination
                    </button>
                </div>
            </div>

            {isLoading ? (<p className="text-center text-xl">Loading destinations...</p>) : (
                <div style={{ overflowX: 'auto' }}>
                    <div className="bg-white shadow rounded-lg" style={{ minWidth: '1000px' }}>
                        <table className="min-w-full divide-y divide-gray-200 custom-table">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left w-10">
                                        <input type="checkbox" checked={allSelected} onChange={handleSelectAll} className="form-checkbox" />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SNO</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {destinationList.map((destination) => {
                                    const id = getDestinationId(destination);
                                    return (
                                        <tr key={id}> 
                                            <td className="px-6 py-4 whitespace-nowrap w-10">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectionModel.includes(id)} 
                                                    onChange={() => handleSelectRow(id)} 
                                                    className="form-checkbox" 
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{destination.sno}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{capitalizeWords(destination.title)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{capitalizeWords(destination.destination_type)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{destination.slug}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2 action-icons">
                                                    <button onClick={() => handleUpdateNavigate(id)} title="Edit" className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></button>
                                                    <button onClick={() => { setDuplicateId(id); setOpenDuplicateModal(true); }} title="Duplicate" className="text-purple-600 hover:text-purple-800"><Copy size={18} /></button>
                                                    <button onClick={() => { setDeleteId(id); setSelectionModel([]); setOpenDeleteModal(true); }} title="Delete" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                                    <button onClick={() => handlePreview(destination.slug, id)} title="Preview" className="text-green-600 hover:text-green-800"><Eye size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <div className="mt-4 flex justify-end items-center text-sm text-gray-700 pagination-controls">
                <span>Rows per page:</span>
                <select className="mx-2 p-1 border rounded custom-select"><option>10</option><option>25</option><option>50</option></select>
                <span>1-5 of {destinationList.length}</span> 
                <div className="flex ml-2 space-x-1 pagination-arrows">
                    <button className="p-1 border rounded pagination-arrow disabled">&lt;</button>
                    <button className="p-1 border rounded pagination-arrow disabled">&gt;</button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <CustomModal
                open={openDeleteModal}
                onClickOutside={() => { setOpenDeleteModal(false); setDeleteId(''); }}
            >
                <div className='delete-model-view-main'>
                    <p className="text-center">
                        {selectionModel.length > 0 && deleteId === null 
                            ? `Are you sure you want to delete the ${selectionModel.length} selected destinations?`
                            : "Are you sure do you want to delete this destination?"}
                    </p>
                    <div className="row">
                        <div className="col-6">
                            <button className="delete-btn yes" onClick={handleDelete}>Yes</button>
                        </div>
                        <div className="col-6">
                            <button className="delete-btn no" onClick={() => { setOpenDeleteModal(false); setDeleteId(''); setSelectionModel([]); }}>No</button>
                        </div>
                    </div>
                </div>
            </CustomModal>
            
            {/* Duplicate Confirmation Modal */}
            <CustomModal
                open={openDuplicateModal}
                onClickOutside={() => { if (!isDuplicating) { setOpenDuplicateModal(false); setDuplicateId(""); } }}
            >
                <div className='delete-model-view-main'>
                    <p className="text-center">Are you sure you want to duplicate this destination?</p>
                    <div className="row">
                        <div className="col-6">
                            <button className="delete-btn yes" onClick={handleDuplicateDestination} disabled={isDuplicating}>
                                {isDuplicating ? 'Duplicating...' : 'Yes, Duplicate'}
                            </button>
                        </div>
                        <div className="col-6">
                            <button className="delete-btn no" onClick={() => { setOpenDuplicateModal(false); setDuplicateId(""); }} disabled={isDuplicating}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </CustomModal>

        </div>
    )
}

export default DestinationList;