import Blog from './Blog';
import React, { useState, useEffect } from 'react';

const DisplayPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/src/data/blogs.json');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Blog Posts</h1>
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </main>
  );
};

export default DisplayPosts;
