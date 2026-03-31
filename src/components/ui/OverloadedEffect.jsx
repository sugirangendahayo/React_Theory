import React from "react";

/*
## Questions:
1. Why is this effect poorly structured?
2. Refactor into a better design

## Problem Analysis:
- Effect handles two unrelated concerns: data fetching and theme styling
- When theme changes, it unnecessarily re-fetches post data
- When postId changes, it unnecessarily re-applies theme styling
- Violates Single Responsibility Principle
- Creates performance issues and unnecessary network requests
- Makes code harder to understand and maintain
*/

// Step 1: Initial buggy implementation (overloaded effect)
function DashboardBuggy({ postId }) {
  const [post, setPost] = React.useState(null);
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => {
    // PROBLEM: Mixing unrelated concerns in one effect
    fetch(`https://dummyjson.com/posts/${postId}`)
      .then((res) => res.json())
      .then(setPost);

    document.body.style.background = theme === "dark" ? "#000" : "#fff";
  }, [postId, theme]); // Both dependencies trigger both actions

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">
        Buggy Dashboard (Overloaded Effect)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Post: {post?.title || "Loading..."}</p>
        <p>Theme: {theme}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Toggle Theme
        </button>
      </div>
      <p className="text-xs text-red-500 mt-2">
        ❌ Theme change triggers unnecessary post fetch!
      </p>
    </div>
  );
}

// Step 2: Wrong fix - still mixing concerns but with conditional logic
function DashboardWrongFix({ postId }) {
  const [post, setPost] = React.useState(null);
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => {
    // WRONG: Still mixing concerns, just with conditionals
    if (postId) {
      fetch(`https://dummyjson.com/posts/${postId}`)
        .then((res) => res.json())
        .then(setPost);
    }

    document.body.style.background = theme === "dark" ? "#000" : "#fff";
  }, [postId, theme]);

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        Wrong Fix (Still Mixed Concerns)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Post: {post?.title || "Loading..."}</p>
        <p>Theme: {theme}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
        >
          Toggle Theme
        </button>
      </div>
      <p className="text-xs text-yellow-600 mt-2">
        ⚠️ Still mixing concerns, just more complex
      </p>
    </div>
  );
}

// Step 3: Correct fix - separate effects
function DashboardFixed({ postId }) {
  const [post, setPost] = React.useState(null);
  const [theme, setTheme] = React.useState("light");

  // CORRECT: Separate effect for data fetching
  React.useEffect(() => {
    if (postId) {
      fetch(`https://dummyjson.com/posts/${postId}`)
        .then((res) => res.json())
        .then(setPost);
    }
  }, [postId]); // Only depends on postId

  // CORRECT: Separate effect for theme styling
  React.useEffect(() => {
    document.body.style.background = theme === "dark" ? "#000" : "#fff";
  }, [theme]); // Only depends on theme

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">
        Fixed Dashboard (Separate Effects)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Post ID: {postId}</p>
        <p>Post: {post?.title || "Loading..."}</p>
        <p>Theme: {theme}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Toggle Theme
        </button>
      </div>
      <p className="text-xs text-green-600 mt-2">
        ✅ Separate effects for separate concerns!
      </p>
    </div>
  );
}

// Step 4: Custom hooks solution
function usePost(postId) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!postId) {
      setPost(null);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
}

function useTheme(initialTheme = "light") {
  const [theme, setTheme] = React.useState(initialTheme);

  React.useEffect(() => {
    document.body.style.background = theme === "dark" ? "#000" : "#fff";
    document.body.style.color = theme === "dark" ? "#fff" : "#000";
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}

function DashboardWithHooks({ postId }) {
  const { post, loading, error } = usePost(postId);
  const { theme, toggleTheme } = useTheme("light");

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        Dashboard with Custom Hooks
      </h3>

      {loading && <div className="text-blue-600 mb-2">Loading post...</div>}

      {error && <div className="text-red-600 mb-2">Error: {error}</div>}

      {!loading && !error && (
        <div className="text-sm text-gray-600 mb-2">
          <p>Post ID: {postId}</p>
          <p>Post: {post?.title || "No post"}</p>
          <p>Theme: {theme}</p>
        </div>
      )}

      <div className="space-x-2">
        <button
          onClick={toggleTheme}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>
      </div>

      <p className="text-xs text-blue-600 mt-2">
        ✅ Clean separation with custom hooks!
      </p>
    </div>
  );
}

// Step 2: Performance monitoring with effect tracking
function useDocumentTheme(theme) {
  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Apply theme to multiple elements
    root.style.setProperty("--bg-color", theme === "dark" ? "#000" : "#fff");
    root.style.setProperty("--text-color", theme === "dark" ? "#fff" : "#000");
    root.style.setProperty(
      "--border-color",
      theme === "dark" ? "#333" : "#ccc",
    );

    body.style.background = theme === "dark" ? "#000" : "#fff";
    body.style.color = theme === "dark" ? "#fff" : "#000";

    // Add theme class to body for CSS styling
    body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);

  // Cleanup function
  React.useEffect(() => {
    return () => {
      // Reset styles on unmount
      const root = document.documentElement;
      const body = document.body;

      root.style.removeProperty("--bg-color");
      root.style.removeProperty("--text-color");
      root.style.removeProperty("--border-color");
      body.style.background = "";
      body.style.color = "";
      body.className = "";
    };
  }, []);
}

function AdvancedDashboard({ postId }) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [theme, setTheme] = React.useState("light");
  const [preferences, setPreferences] = React.useState({
    autoSave: true,
    notifications: false,
  });

  // Effect for post fetching
  React.useEffect(() => {
    if (!postId) {
      setPost(null);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://dummyjson.com/posts/${postId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Effect for theme management
  useDocumentTheme(theme);

  // Effect for preferences persistence
  React.useEffect(() => {
    localStorage.setItem("dashboard-preferences", JSON.stringify(preferences));
  }, [preferences]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const updatePreference = React.useCallback((key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="p-4 border border-indigo-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">
        Advanced Dashboard (Multiple Separated Effects)
      </h3>

      {loading && <div className="text-blue-600 mb-2">Loading post...</div>}

      {error && <div className="text-red-600 mb-2">Error: {error}</div>}

      {!loading && !error && (
        <div className="text-sm text-gray-600 mb-2">
          <p>Post ID: {postId}</p>
          <p>Post: {post?.title || "No post"}</p>
          <p>Theme: {theme}</p>
          <p>Auto-save: {preferences.autoSave ? "On" : "Off"}</p>
          <p>Notifications: {preferences.notifications ? "On" : "Off"}</p>
        </div>
      )}

      <div className="space-x-2 space-y-2">
        <button
          onClick={toggleTheme}
          className="px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600"
        >
          Toggle Theme
        </button>
        <button
          onClick={() => updatePreference("autoSave", !preferences.autoSave)}
          className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
        >
          Toggle Auto-save
        </button>
        <button
          onClick={() =>
            updatePreference("notifications", !preferences.notifications)
          }
          className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
        >
          Toggle Notifications
        </button>
      </div>

      <p className="text-xs text-indigo-600 mt-2">
        ✅ Advanced: Multiple separated effects with proper cleanup
      </p>
    </div>
  );
}

export default function OverloadedEffect() {
  const [postId, setPostId] = React.useState(1);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Overloaded Effect Bug
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Why is this effect poorly structured?</li>
          <li>Refactor into a better design</li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Post ID:
          <input
            type="number"
            value={postId}
            onChange={(e) => setPostId(parseInt(e.target.value) || 1)}
            className="ml-2 px-2 py-1 border rounded"
            min="1"
            max="100"
          />
        </label>
        <p className="text-xs text-gray-500">
          Change post ID to see how different implementations behave
        </p>
      </div>

      <DashboardBuggy postId={postId} />
      <DashboardWrongFix postId={postId} />
      <DashboardFixed postId={postId} />
      <DashboardWithHooks postId={postId} />
      <PerformanceDashboard postId={postId} />
      <AdvancedDashboard postId={postId} />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Problem:</strong> Effect handles unrelated concerns (data +
            styling)
          </li>
          <li>
            <strong>Issue:</strong> Theme change triggers unnecessary post fetch
          </li>
          <li>
            <strong>Violation:</strong> Breaks Single Responsibility Principle
          </li>
          <li>
            <strong>Solution:</strong> Separate effects for separate concerns
          </li>
          <li>
            <strong>Performance:</strong> Prevents unnecessary re-execution of
            effects
          </li>
          <li>
            <strong>Best practice:</strong> Extract logic into custom hooks
          </li>
        </ul>
      </div>
    </div>
  );
}
