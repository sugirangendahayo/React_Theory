import React from "react";

/*
## Questions:
1. Click the button multiple times quickly - what happens?
2. Explain why the count behaves unexpectedly
3. Fix the bug so each click increments correctly

## Problem Analysis:
- The stale closure bug occurs because the handleClick function captures the 'count' value
- When setTimeout executes, it uses the stale 'count' value from when the handler was created
- Multiple clicks create multiple closures, each with their own stale 'count' value
*/

// Step 1: Initial buggy implementation
function CounterBuggy() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    // BUG: This creates a stale closure
    // The 'count' value is captured when handleClick is called
    // setTimeout will use this stale value after 1 second
    setTimeout(() => {
      setCount(count + 1); // Uses stale count value
    }, 1000);
  }

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">Buggy Counter</h3>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Click multiple times quickly - notice the bug!
      </p>
    </div>
  );
}

// Step 2: Functional update fix
function CounterFixed() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    // FIX: Use functional update to avoid stale closure
    // setCount receives the latest state value as an argument
    // This ensures we always work with the most recent count
    setTimeout(() => {
      setCount((prevCount) => prevCount + 1); // Gets latest state
    }, 1000);
  }

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">
        Fixed Counter (Functional Update)
      </h3>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Fixed! Each click now increments correctly after 1 second.
      </p>
    </div>
  );
}

// Step 3: Alternative fix with useRef
function CounterFixedRef() {
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(count);

  // Keep ref in sync with state
  React.useEffect(() => {
    countRef.current = count;
  }, [count]);

  function handleClick() {
    // FIX: Use useRef to store current count value
    // Ref persists across re-renders and doesn't cause stale closures
    setTimeout(() => {
      setCount(countRef.current + 1); // Uses ref value
    }, 1000);
  }

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        Fixed Counter (useRef)
      </h3>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Fixed using useRef to maintain current count reference.
      </p>
    </div>
  );
}

export default function StaleClosureBug() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Stale Closure Bug Demonstration
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions to Answer:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click the buggy button multiple times quickly - what happens?</li>
          <li>Explain why the count behaves unexpectedly</li>
          <li>Fix the bug so each click increments correctly</li>
        </ol>
      </div>

      <CounterBuggy />
      <CounterFixed />
      <CounterFixedRef />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Buggy version:</strong> Each setTimeout captures the stale
            'count' value from when the handler was created
          </li>
          <li>
            <strong>Functional update fix:</strong> Uses setCount(prev {">"}=
            prev + 1) to get the latest state
          </li>
          <li>
            <strong>useRef fix:</strong> Stores current count in a ref that
            persists across re-renders
          </li>
        </ul>
      </div>
    </div>
  );
}
