import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // <<< ADDED LINK HERE
import ReactQuill from 'react-quill'; // Rich text editor
import 'react-quill/dist/quill.snow.css'; // Quill styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';

// Placeholder for API call utility
// import api from '../../utils/api'; 
// import { toast } from 'react-toastify';

const initialPostState = {
    heading: '',
    category_id: null, // Should be an ID
    featured_image: '', // URL
    alt_tag: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    author_name: 'Admin User',
    tag_ids: [], // Array of IDs
    is_featured: false,
    is_published: false,
    description: '', // This will hold the HTML content from Quill
    meta_title: '',
    meta_tag: '',
    meta_description: '',
    slug: '',
    tenant_id: 1, // Assuming a default tenant ID
};

export default function BlogCreate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [postData, setPostData] = useState(initialPostState);
    const [categories, setCategories] = useState([]); // Mock categories
    const [tags, setTags] = useState([]); // Mock tags
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mock data fetch for categories and tags
        setCategories([{ id: 1, name: 'Technology' }, { id: 2, name: 'Travel' }]);
        setTags([{ id: 10, name: 'react' }, { id: 11, name: 'api' }, { id: 12, name: 'design' }]);

        if (id) {
            setLoading(true);
            // In a real app, fetch post data for editing
            /*
            api.get(`/blog-posts/${id}`).then(res => {
                setPostData(res.data);
                setLoading(false);
            });
            */
            // Mock fetching data for editing
            const mockEditData = { ...initialPostState, heading: `Editing Post ${id}`, description: `<p>This is the content for post ${id}</p>`, is_published: true, slug: `editing-post-${id}` };
            setPostData(mockEditData);
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPostData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Auto-generate slug from heading
        if (name === 'heading' && !id) { // Only auto-generate on create mode
            setPostData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
            }));
        }
    };
    
    const handleQuillChange = (content) => {
        setPostData(prev => ({ ...prev, description: content }));
    };
    
    const handleTagChange = (e) => {
        const { options } = e.target;
        const selectedTags = Array.from(options)
            .filter(option => option.selected)
            .map(option => Number(option.value));
        
        setPostData(prev => ({ ...prev, tag_ids: selectedTags }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = id ? `/blog-posts/${id}` : '/blog-posts/';
        const method = id ? 'PUT' : 'POST';

        console.log(`Submitting blog post with method: ${method} to ${endpoint}`, postData);
        
        // In a real app, make API call here
        /*
        try {
            const response = await api[method.toLowerCase()](endpoint, postData);
            toast.success(`Post ${id ? 'updated' : 'created'} successfully!`);
            navigate('/admin/dashboard/blog/list');
        } catch (error) {
            toast.error(`Error ${id ? 'updating' : 'creating'} post.`);
        } finally {
            setLoading(false);
        }
        */
        
        // Mock success
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Successfully ${id ? 'updated' : 'created'} post: ${postData.heading}`);
        setLoading(false);
        navigate('/admin/dashboard/blog/list');
    };

    if (loading && id) return <div className="p-8">Loading post data...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">{id ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column (Main Content) */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Title and Slug */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title (Heading)</label>
                            <input
                                type="text"
                                name="heading"
                                value={postData.heading}
                                onChange={handleChange}
                                placeholder="Enter post title here"
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                            />
                            <p className="text-xs text-gray-500 mt-1">Slug: /blog/{postData.slug || '...'}</p>
                            <input
                                type="text"
                                name="slug"
                                value={postData.slug}
                                onChange={handleChange}
                                placeholder="Post slug (URL)"
                                className="w-full border border-gray-300 p-2 rounded-lg text-sm mt-2"
                            />
                        </div>

                        {/* Rich Text Editor (Description) */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content / Description</label>
                            <ReactQuill 
                                theme="snow" 
                                value={postData.description} 
                                onChange={handleQuillChange} 
                                className="h-96 mb-12"
                                modules={{
                                    toolbar: [
                                      [{ 'header': [1, 2, false] }],
                                      ['bold', 'italic', 'underline','strike', 'blockquote'],
                                      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                      ['link', 'image', 'video'],
                                      ['clean']
                                    ],
                                  }}
                            />
                        </div>
                        
                        {/* SEO Section */}
                        <div className="card p-6 bg-white shadow-md rounded-lg mt-12">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                                    <input type="text" name="meta_title" value={postData.meta_title} onChange={handleChange} className="w-full border p-2 rounded" placeholder="SEO Title for search engines" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Tags (Keywords)</label>
                                    <input type="text" name="meta_tag" value={postData.meta_tag} onChange={handleChange} className="w-full border p-2 rounded" placeholder="comma, separated, keywords" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                                    <textarea name="meta_description" value={postData.meta_description} onChange={handleChange} className="w-full border p-2 rounded h-20" placeholder="A brief summary for search results"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Publishing & Attributes) */}
                    <div className="space-y-6">
                        {/* Publish Box */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Publish</h3>
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={postData.is_published}
                                        onChange={handleChange}
                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    Publish Now
                                </label>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={postData.is_featured}
                                        onChange={handleChange}
                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    Featured Post
                                </label>
                            </div>
                            
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input type="date" name="date" value={postData.date} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Author Name</label>
                                <input type="text" name="author_name" value={postData.author_name} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => navigate('/admin/dashboard/blog/list')} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 flex items-center">
                                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50">
                                    <FontAwesomeIcon icon={faSave} className="mr-2" /> {loading ? 'Saving...' : id ? 'Update Post' : 'Save Post'}
                                </button>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Featured Image</h3>
                            {postData.featured_image ? (
                                <img src={postData.featured_image} alt="Featured" className="w-full h-32 object-cover mb-3 rounded" />
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 mb-3 rounded bg-gray-50 text-gray-500">
                                    No Image Selected
                                </div>
                            )}
                            <button type="button" className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUpload} className="mr-2" /> Upload Image
                            </button>
                            <input
                                type="text"
                                name="alt_tag"
                                value={postData.alt_tag}
                                onChange={handleChange}
                                placeholder="Alt Tag"
                                className="w-full border p-2 rounded text-sm mt-3"
                            />
                            <p className="text-xs text-gray-500 mt-1">Image URL: {postData.featured_image}</p>
                        </div>
                        
                        {/* Categories */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Categories</h3>
                            <select
                                name="category_id"
                                value={postData.category_id || ''}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">— Select Category —</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {/* Line 274 is here: The Link component was missing the import */}
                            <p className="text-xs text-gray-500 mt-2">Manage categories <Link to="/admin/dashboard/blog/categories" className="text-blue-500 hover:underline">here</Link>.</p>
                        </div>

                        {/* Tags */}
                        <div className="card p-6 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Tags</h3>
                            <select
                                name="tag_ids"
                                multiple
                                value={postData.tag_ids.map(String)} // Select expects string values
                                onChange={handleTagChange}
                                className="w-full border p-2 rounded h-32"
                            >
                                {tags.map(tag => (
                                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple tags. Manage tags <Link to="/admin/dashboard/blog/tags" className="text-blue-500 hover:underline">here</Link>.</p>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
}