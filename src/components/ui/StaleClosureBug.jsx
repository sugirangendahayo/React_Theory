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
- SOLUTION: Use functional update setCount(prev => prev + 1) to get the latest state
*/

function Counter() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setTimeout(() => {
      // FIX: Use functional update to avoid stale closure
      // This ensures we always work with the most recent count value
      // Instead of using the stale 'count' captured when handleClick was called
      setCount((prev) => prev + 1);
    }, 1000);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Stale Closure Bug Fix
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click the button multiple times quickly - what happens?</li>
          <li>Explain why the count behaves unexpectedly</li>
          <li>Fix the bug so each click increments correctly</li>
        </ol>
      </div>

      <div className="p-4 border border-green-300 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-green-600 mb-2">
          Fixed Counter
        </h3>
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        >
          Count: {count}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Click multiple times quickly - each click increments correctly after 1
          second!
        </p>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Bug:</strong> setTimeout captures stale 'count' value from
            when handler was created
          </li>
          <li>
            <strong>Fix:</strong> Use setCount(prev {">"}= prev + 1) to get the
            latest state
          </li>
          <li>
            <strong>Result:</strong> Each click now correctly increments the
            count
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Counter;
