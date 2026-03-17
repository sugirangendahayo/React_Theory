import { useEffect, useState } from "react";
import Blog from "./components/ui/Blog";
import NavBar from "./components/ui/NavBar";

function App() {
  console.log("App component re-rendered");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); 

  useEffect(() => {
    console.log(" useEffect running");

    const fetchBlogs = async () => {
      console.log("Fetching blogs...");

      try {
        const response = await fetch("/src/data/blogs.json");
        const data = await response.json();

        console.log("Data received");
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  },[]); 

  return (
    <>
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Blog Posts
        </h1>

        <div className="text-center mb-6">
          <p>Count: {count}</p>
          <button
            onClick={() => {
              console.log(" Button clicked");
              setCount(count + 1);
            }}
            className="bg-cyan-500 text-white px-4 py-2 rounded"
          >
            Increase Count
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="max-w-4xl mx-auto">
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default App;