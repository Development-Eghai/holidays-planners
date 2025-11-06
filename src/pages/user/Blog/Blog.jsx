import React, { useEffect, useState } from 'react';
import BlogListComponent from '../../../components/blog/bloglist';
import { useLocation, useNavigate } from 'react-router-dom';

const Blog = () => {
  const [blogId, setBlogId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get blogId from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('blogId');

    if (id) {
      setBlogId(id);
      console.log('Blog ID from URL:', id);
    }
  }, [location.search]);

  // Listen for URL changes when user navigates back/forward
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('blogId');
      if (id) {
        setBlogId(id);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleBlogSelect = (selectedBlogId) => {
    // Update URL with blog ID
    navigate(`/blog?blogId=${selectedBlogId}`);
    setBlogId(selectedBlogId);
  };

  return (
    <div>
      <BlogListComponent onBlogSelect={handleBlogSelect} selectedBlogId={blogId} />
    </div>
  );
};

export default Blog;