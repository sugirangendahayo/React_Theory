import React from "react";

/*
## Questions:
1. Why does the console always log the same value?
2. Fix it without causing unnecessary re-renders every second

## Problem Analysis:
- The useEffect has an empty dependency array []
- This means it only runs once when component mounts
- The setInterval captures the stale 'count' value from the initial render
- Even though count changes, the interval always logs the initial value (0)
*/

// Step 1: Initial buggy implementation
function LoggerBuggy() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      // BUG: This logs stale count value (always 0)
      // The count value is captured once when useEffect runs
      console.log(count);
    }, 1000);

    return () => clearInterval(id);
  }, []); // Empty dependency array - runs only once

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">Buggy Logger</h3>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Increment: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Check console - it always logs 0!
      </p>
    </div>
  );
}

// Step 2: Wrong fix - causes re-renders every second
function LoggerWrongFix() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      console.log(count);
    }, 1000);

    return () => clearInterval(id);
  }, [count]); // BAD: Re-creates interval every time count changes

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        Wrong Fix (Performance Issue)
      </h3>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Increment: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Works but creates new interval every second - bad performance!
      </p>
    </div>
  );
}

// Step 3: Alternative fix with useCallback (still not ideal)
function LoggerCallbackFix() {
  const [count, setCount] = React.useState(0);

  const logCount = React.useCallback(() => {
    console.log(count);
  }, [count]);

  React.useEffect(() => {
    const id = setInterval(logCount, 1000);
    return () => clearInterval(id);
  }, [logCount]); // Still recreates interval when count changes

  return (
    <div className="p-4 border border-orange-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-orange-600 mb-2">
        useCallback Fix (Still Not Ideal)
      </h3>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Increment: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Uses useCallback but still recreates interval - not optimal!
      </p>
    </div>
  );
}

// Step 4: Correct fix using useRef
function LoggerFixed() {
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(count);

  // Keep ref in sync with state
  React.useEffect(() => {
    countRef.current = count;
  });

  React.useEffect(() => {
    const id = setInterval(() => {
      // FIX: Use ref to get current count value
      // Ref persists across re-renders and always has latest value
      console.log(countRef.current);
    }, 1000);

    return () => clearInterval(id);
  }, []); // Empty dependency array - interval created once

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">
        Fixed Logger (useRef - Optimal)
      </h3>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Increment: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Fixed! Console logs current count without performance issues.
      </p>
    </div>
  );
}

export default function StaleEffectDependency() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Stale Effect Dependency Bug
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Why does the console always log the same value?</li>
          <li>Fix it without causing unnecessary re-renders every second</li>
        </ol>
      </div>

      <LoggerBuggy />
      <LoggerWrongFix />
      <LoggerCallbackFix />
      <LoggerFixed />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Bug:</strong> useEffect with [] captures stale count value
            (always 0)
          </li>
          <li>
            <strong>Wrong fix:</strong> Adding [count] recreates interval every
            second
          </li>
          <li>
            <strong>Correct fix:</strong> Use useRef to maintain current count
            reference
          </li>
        </ul>
      </div>
    </div>
  );
}
