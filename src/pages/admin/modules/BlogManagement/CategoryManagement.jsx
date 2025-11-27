import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function CategoryManagement() {
    const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', parent: 'none' });
    const [categories, setCategories] = useState([
        { id: 1, name: 'Jira', slug: 'jira', description: '', count: 0 },
        { id: 2, name: 'Uncategorized', slug: 'uncategorized', description: '', count: 2 }
    ]);

    const handleNewCatChange = (e) => {
        const { name, value } = e.target;
        setNewCat(prev => ({ 
            ...prev, 
            [name]: value 
        }));
        if (name === 'name') {
            setNewCat(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
            }));
        }
    };

    const handleAddCat = (e) => {
        e.preventDefault();
        if (!newCat.name) return;
        const newId = categories.length + 1;
        setCategories(prev => [...prev, { id: newId, ...newCat, count: 0 }]);
        setNewCat({ name: '', slug: '', description: '', parent: 'none' });
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Add New Category (Left Column) */}
                <div className="md:col-span-1">
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Add New Category</h3>
                        <form onSubmit={handleAddCat} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name" value={newCat.name} onChange={handleNewCatChange} placeholder="The name is how it appears on your site." required className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input type="text" name="slug" value={newCat.slug} onChange={handleNewCatChange} placeholder="URL-friendly version" className="w-full border p-2 rounded" />
                                <p className="text-xs text-gray-500 mt-1">The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                                <select name="parent" value={newCat.parent} onChange={handleNewCatChange} className="w-full border p-2 rounded">
                                    <option value="none">None</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Categories, unlike tags, can have a hierarchy.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={newCat.description} onChange={handleNewCatChange} className="w-full border p-2 rounded h-20"></textarea>
                                <p className="text-xs text-gray-500 mt-1">The description is not prominent by default; however, some themes may show it.</p>
                            </div>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Category
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List (Right Column) */}
                <div className="md:col-span-2">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description || '—'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{cat.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 mx-2" title="Edit">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900 mx-2" title="Delete">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 text-sm text-gray-600 border-t">
                            Deleting a category does not delete the posts in that category. Instead, posts that were only assigned to the deleted category are set to the default category **Uncategorized**.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}