import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function TagManagement() {
    const [newTag, setNewTag] = useState({ name: '', slug: '', description: '' });
    const [tags, setTags] = useState([
        { id: 1, name: 'react', slug: 'react', description: '', count: 1 },
        { id: 2, name: 'travel', slug: 'travel', description: '', count: 5 }
    ]);

    const handleNewTagChange = (e) => {
        const { name, value } = e.target;
        setNewTag(prev => ({ 
            ...prev, 
            [name]: value 
        }));
        if (name === 'name') {
            setNewTag(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
            }));
        }
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        if (!newTag.name) return;
        const newId = tags.length + 1;
        setTags(prev => [...prev, { id: newId, ...newTag, count: 0 }]);
        setNewTag({ name: '', slug: '', description: '' });
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            setTags(tags.filter(t => t.id !== id));
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Add New Tag (Left Column) */}
                <div className="md:col-span-1">
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Add New Tag</h3>
                        <form onSubmit={handleAddTag} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name" value={newTag.name} onChange={handleNewTagChange} placeholder="The name is how it appears on your site." required className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input type="text" name="slug" value={newTag.slug} onChange={handleNewTagChange} placeholder="URL-friendly version" className="w-full border p-2 rounded" />
                                <p className="text-xs text-gray-500 mt-1">The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={newTag.description} onChange={handleNewTagChange} className="w-full border p-2 rounded h-20"></textarea>
                                <p className="text-xs text-gray-500 mt-1">The description is not prominent by default; however, some themes may show it.</p>
                            </div>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Tag
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tags List (Right Column) */}
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
                                {tags.map(tag => (
                                    <tr key={tag.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tag.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.description || '—'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{tag.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 mx-2" title="Edit">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleDelete(tag.id)} className="text-red-600 hover:text-red-900 mx-2" title="Delete">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}