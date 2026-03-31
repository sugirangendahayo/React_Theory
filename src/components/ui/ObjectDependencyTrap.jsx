import React from 'react';

/*
## Questions:
1. Why does this refetch on every render?
2. Fix it without removing necessary dependencies

## Problem Analysis:
- The options object { query } is recreated on every render
- Objects are compared by reference, not by value
- Even if the content is the same, the reference is different each render
- This causes useEffect to run on every render because options reference changes
*/

// Step 1: Initial buggy implementation
function SearchBuggy({ query }) {
  const [results, setResults] = React.useState([]);

  const options = { query }; // BUG: New object created on every render

  React.useEffect(() => {
    console.log('Fetching with options:', options);
    fetch("https://dummyjson.com/posts/search", { 
      method: "POST", 
      body: JSON.stringify(options) 
    })
      .then(res => res.json())
      .then(setResults);
  }, [options]); // Re-runs on every render due to new object reference

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">Buggy Search (Refetches Every Render)</h3>
      <p className="text-sm text-gray-600 mb-2">
        Query: "{query}" | Results: {results.length}
      </p>
      <p className="text-xs text-red-500">
        Check console - refetches on every render!
      </p>
    </div>
  );
}

// Step 2: Wrong fix - removing dependencies
function SearchWrongFix({ query }) {
  const [results, setResults] = React.useState([]);

  const options = { query };

  React.useEffect(() => {
    console.log('Fetching with options:', options);
    fetch("https://dummyjson.com/posts/search", { 
      method: "POST", 
      body: JSON.stringify(options) 
    })
      .then(res => res.json())
      .then(setResults);
  }, []); // WRONG: No dependencies - won't refetch when query changes

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">Wrong Fix (No Dependencies)</h3>
      <p className="text-sm text-gray-600 mb-2">
        Query: "{query}" | Results: {results.length}
      </p>
      <p className="text-xs text-yellow-600">
        Fixed refetching but won't update when query changes!
      </p>
    </div>
  );
}

// Step 3: Correct fix with useMemo
function SearchFixedMemo({ query }) {
  const [results, setResults] = React.useState([]);

  // FIX: Memoize the options object to prevent recreation
  const options = React.useMemo(() => ({ query }), [query]);

  React.useEffect(() => {
    console.log('Fetching with memoized options:', options);
    fetch("https://dummyjson.com/posts/search", { 
      method: "POST", 
      body: JSON.stringify(options) 
    })
      .then(res => res.json())
      .then(setResults);
  }, [options]); // Only re-runs when query actually changes

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">Fixed Search (useMemo)</h3>
      <p className="text-sm text-gray-600 mb-2">
        Query: "{query}" | Results: {results.length}
      </p>
      <p className="text-xs text-green-600">
        ✅ Fixed! Only refetches when query actually changes.
      </p>
    </div>
  );
}

// Step 4: Alternative fix with useCallback
function SearchFixedCallback({ query }) {
  const [results, setResults] = React.useState([]);

  // FIX: Memoize the fetch function
  const fetchResults = React.useCallback(() => {
    const options = { query };
    console.log('Fetching with callback:', options);
    fetch("https://dummyjson.com/posts/search", { 
      method: "POST", 
      body: JSON.stringify(options) 
    })
      .then(res => res.json())
      .then(setResults);
  }, [query]);

  React.useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Fixed Search (useCallback)</h3>
      <p className="text-sm text-gray-600 mb-2">
        Query: "{query}" | Results: {results.length}
      </p>
      <p className="text-xs text-blue-600">
        ✅ Fixed! Uses useCallback to memoize fetch logic.
      </p>
    </div>
  );
}

// Step 5: Simple fix - move object inside useEffect
function SearchFixedSimple({ query }) {
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    // FIX: Create options object inside useEffect
    const options = { query };
    console.log('Fetching with internal options:', options);
    fetch("https://dummyjson.com/posts/search", { 
      method: "POST", 
      body: JSON.stringify(options) 
    })
      .then(res => res.json())
      .then(setResults);
  }, [query]); // Depend on query directly, not the object

  return (
    <div className="p-4 border border-purple-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-purple-600 mb-2">Fixed Search (Simple)</h3>
      <p className="text-sm text-gray-600 mb-2">
        Query: "{query}" | Results: {results.length}
      </p>
      <p className="text-xs text-purple-600">
        ✅ Fixed! Move object inside useEffect, depend on query.
      </p>
    </div>
  );
}

export default function ObjectDependencyTrap() {
  const [query, setQuery] = React.useState("react");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Object Dependency Trap Bug</h2>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Why does this refetch on every render?</li>
          <li>Fix it without removing necessary dependencies</li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Search Query:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 px-2 py-1 border rounded"
            placeholder="Type to test..."
          />
        </label>
        <p className="text-xs text-gray-500">
          Change the query to see how different implementations behave
        </p>
      </div>

      <SearchBuggy query={query} />
      <SearchWrongFix query={query} />
      <SearchFixedMemo query={query} />
      <SearchFixedCallback query={query} />
      <SearchFixedSimple query={query} />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Bug:</strong> Object {query} is recreated on every render</li>
          <li><strong>Wrong fix:</strong> Removing dependencies breaks reactivity</li>
          <li><strong>useMemo fix:</strong> Memoize object to prevent recreation</li>
          <li><strong>useCallback fix:</strong> Memoize fetch function instead</li>
          <li><strong>Simple fix:</strong> Move object inside useEffect, depend on primitive</li>
        </ul>
      </div>
    </div>
  );
}
