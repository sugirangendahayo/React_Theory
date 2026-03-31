import React from "react";

/*
## Questions:
1. Identify why this causes an infinite loop
2. Refactor it so data is fetched correctly

## Problem Analysis:
- The useEffect includes [data] in dependency array
- When component mounts, useEffect runs and fetches data
- setData updates the data state
- This triggers useEffect again because data changed
- This creates an infinite loop of fetching and updating
*/

// Step 1: Initial buggy implementation
function AppBuggy() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then(setData);
  }, [data]); // BUG: Including data causes infinite loop

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">
        Buggy App (Infinite Loop)
      </h3>
      <p className="text-sm text-gray-600 mb-2">Posts loaded: {data.length}</p>
      <p className="text-xs text-red-500">
        Check network tab - infinite requests!
      </p>
    </div>
  );
}

// Step 2: Wrong fix - removing dependencies completely
function AppWrongFix() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then(setData);
  }, []); // BETTER: Empty dependency array prevents infinite loop
  // But this is still not ideal - no error handling, no loading state

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        Partial Fix (No Error Handling)
      </h3>
      <p className="text-sm text-gray-600 mb-2">Posts loaded: {data.length}</p>
      <p className="text-xs text-yellow-600">
        Fixed infinite loop but missing loading/error states
      </p>
    </div>
  );
}

// Step 3: Complete solution with loading and error states
function AppFixed() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://dummyjson.com/posts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.posts || result); // Handle different response structures
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // CORRECT: Empty dependency array - fetch only on mount

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">
        Fixed App (Complete Solution)
      </h3>

      {loading && <div className="text-blue-600 mb-2">Loading posts...</div>}

      {error && <div className="text-red-600 mb-2">Error: {error}</div>}

      {!loading && !error && (
        <p className="text-sm text-gray-600 mb-2">
          Posts loaded: {data.length}
        </p>
      )}

      <p className="text-xs text-green-600">
        ✅ Fixed infinite loop + added loading/error states
      </p>
    </div>
  );
}

// Step 2: Custom hook solution
function AppAdvanced() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://dummyjson.com/posts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.posts || result);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount]); // Re-fetch when retryCount changes

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        Advanced App (With Retry)
      </h3>

      {loading && <div className="text-blue-600 mb-2">Loading posts...</div>}

      {error && (
        <div className="text-red-600 mb-2">
          Error: {error}
          <button
            onClick={handleRetry}
            className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Posts loaded: {data.length}
          </p>
          <button
            onClick={handleRetry}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      )}

      <p className="text-xs text-blue-600 mt-2">
        ✅ Advanced solution with retry functionality
      </p>
    </div>
  );
}

export default function InfiniteEffectLoop() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Infinite Effect Loop Bug
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Identify why this causes an infinite loop</li>
          <li>Refactor it so data is fetched correctly</li>
        </ol>
      </div>

      <AppBuggy />
      <AppWrongFix />
      <AppFixed />
      <AppWithHook />
      <AppAdvanced />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Bug:</strong> Including [data] in useEffect causes infinite
            loop
          </li>
          <li>
            <strong>Wrong fix:</strong> Just removing dependencies works but
            incomplete
          </li>
          <li>
            <strong>Correct fix:</strong> Use empty [] + add loading/error
            states
          </li>
          <li>
            <strong>Custom hook:</strong> Extract logic into reusable custom
            hook
          </li>
          <li>
            <strong>Advanced:</strong> Add retry functionality with controlled
            re-fetching
          </li>
        </ul>
      </div>
    </div>
  );
}
