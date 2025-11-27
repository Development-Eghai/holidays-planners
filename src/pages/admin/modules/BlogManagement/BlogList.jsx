import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

export default function BlogList() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch
        const mockPosts = [
            { id: 1, title: 'First Blog Post', author: 'Jane Doe', category: 'Technology', date: '2025-11-20', published: true },
            { id: 2, title: 'Travel Guide: Bali', author: 'Admin User', category: 'Travel', date: '2025-11-15', published: false },
        ];
        setPosts(mockPosts);
        setLoading(false);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete post ID: ${id}?`)) {
            // Implement actual API delete call here
            setPosts(posts.filter(post => post.id !== id));
            // toast.success(`Post ${id} deleted.`);
        }
    };

    if (loading) return <div className="p-8">Loading blog posts...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-semibold text-gray-800">All Blog Posts</h2>
                <button 
                    onClick={() => navigate('/admin/dashboard/blog/create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Post
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map(post => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => navigate(`/admin/dashboard/blog/create/${post.id}`)} className="text-indigo-600 hover:text-indigo-900 mx-2" title="Edit">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 mx-2" title="Delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-900 mx-2" title="View">
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {posts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No posts found. <button onClick={() => navigate('/admin/dashboard/blog/create')} className="text-blue-600 hover:underline">Create your first post!</button>
                </div>
            )}
        </div>
    );
}