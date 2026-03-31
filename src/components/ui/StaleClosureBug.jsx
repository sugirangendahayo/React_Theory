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

export default CounterBuggy;
