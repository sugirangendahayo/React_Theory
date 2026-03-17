import React from 'react';

const Blog = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{blog.title}</h2>
      <p className="text-gray-600 mb-4">{blog.description}</p>
      <p className="text-gray-700 mb-4 leading-relaxed">{blog.content}</p>
     { <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
        <span className="font-medium">By {blog.author}</span>
        <span>{new Date(blog.date).toLocaleDateString()}</span>
      </div>}
    </div>
  );
};

export default Blog;
