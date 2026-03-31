import React from "react";

/*
## Questions:
1. Why does count only increase by 1 instead of 2?
2. Fix it and explain why your solution works

## Problem Analysis:
- React batches state updates for performance
- Both setCount calls use the same initial count value (0)
- React processes them in a single batch: setCount(1), setCount(1)
- The second call overwrites the first, resulting in count = 1
- This is called "stale state" within the same render cycle
*/

// Step 1: Initial buggy implementation
function CounterBuggy() {
  const [count, setCount] = React.useState(0);

  function increment() {
    // BUG: Both calls use the same stale count value
    setCount(count + 1); // setCount(0 + 1) = 1
    setCount(count + 1); // setCount(0 + 1) = 1 (overwrites first)
  }

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">
        Buggy Counter (Batching Issue)
      </h3>
      <button
        onClick={increment}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Click button - count only increases by 1 instead of 2!
      </p>
    </div>
  );
}

// Step 2: Wrong fix - setTimeout breaks batching
function CounterWrongFix() {
  const [count, setCount] = React.useState(0);

  function increment() {
    // WRONG: Using setTimeout breaks batching but is inefficient
    setCount(count + 1);
    setTimeout(() => {
      setCount(count + 1);
    }, 0);
  }

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        Wrong Fix (setTimeout)
      </h3>
      <button
        onClick={increment}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Works but breaks React batching - inefficient!
      </p>
    </div>
  );
}

// Step 3: Correct fix - functional updates
function CounterFixed() {
  const [count, setCount] = React.useState(0);

  function increment() {
    // CORRECT: Use functional updates to get latest state
    setCount((prevCount) => prevCount + 1); // prevCount = 0, returns 1
    setCount((prevCount) => prevCount + 1); // prevCount = 1, returns 2
  }

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">
        Fixed Counter (Functional Updates)
      </h3>
      <button
        onClick={increment}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        ✅ Fixed! Count increases by 2 using functional updates.
      </p>
    </div>
  );
}

// Step 4: Alternative fix - flushSync
function CounterFlushSync() {
  const [count, setCount] = React.useState(0);

  function increment() {
    // ALTERNATIVE: Use flushSync to force immediate updates
    React.flushSync(() => {
      setCount(count + 1);
    });
    setCount(count + 1);
  }

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        Fixed Counter (flushSync)
      </h3>
      <button
        onClick={increment}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Count: {count}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        ✅ Works! Forces immediate update, but functional updates are preferred.
      </p>
    </div>
  );
}

// Step 5: Custom hook for multiple increments
function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue);

  const increment = React.useCallback((amount = 1) => {
    setCount((prevCount) => prevCount + amount);
  }, []);

  const incrementMultiple = React.useCallback((times = 2) => {
    setCount((prevCount) => prevCount + times);
  }, []);

  const incrementSequential = React.useCallback((times = 2) => {
    for (let i = 0; i < times; i++) {
      setCount((prevCount) => prevCount + 1);
    }
  }, []);

  return { count, increment, incrementMultiple, incrementSequential };
}

function CounterWithHook() {
  const { count, increment, incrementMultiple, incrementSequential } =
    useCounter(0);

  return (
    <div className="p-4 border border-purple-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-purple-600 mb-2">
        Counter with Custom Hook
      </h3>
      <div className="space-y-2">
        <button
          onClick={() => increment()}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 mr-2"
        >
          +1
        </button>
        <button
          onClick={() => incrementMultiple(2)}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 mr-2"
        >
          +2
        </button>
        <button
          onClick={() => incrementSequential(3)}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          +3 (sequential)
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">Count: {count}</p>
      <p className="text-xs text-purple-600">
        ✅ Clean: Custom hook with functional update patterns
      </p>
    </div>
  );
}

// Step 6: Complex example with multiple state updates
function ComplexCounter() {
  const [count, setCount] = React.useState(0);
  const [history, setHistory] = React.useState([]);
  const [lastAction, setLastAction] = React.useState("");

  function complexIncrement() {
    // Multiple state updates with functional forms
    setCount((prevCount) => {
      const newCount = prevCount + 2;
      return newCount;
    });

    setHistory((prevHistory) => [
      ...prevHistory,
      `Incremented to ${count + 2}`,
    ]);
    setLastAction(`Incremented by 2`);
  }

  function reset() {
    setCount(0);
    setHistory([]);
    setLastAction("Reset");
  }

  return (
    <div className="p-4 border border-orange-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-orange-600 mb-2">
        Complex Counter (Multiple State)
      </h3>
      <div className="space-y-2 mb-3">
        <button
          onClick={complexIncrement}
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 mr-2"
        >
          +2 (with history)
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      <div className="text-sm text-gray-600">
        <p>Count: {count}</p>
        <p>Last Action: {lastAction}</p>
        <p>
          History ({history.length} actions): {history.slice(-2).join(", ")}
        </p>
      </div>
      <p className="text-xs text-orange-600 mt-2">
        ✅ Complex: Multiple state updates with functional forms
      </p>
    </div>
  );
}

export default function BatchingFunctionalUpdates() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Batching & Functional Updates
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Why does count only increase by 1 instead of 2?</li>
          <li>Fix it and explain why your solution works</li>
        </ol>
      </div>

      <CounterBuggy />
      <CounterWrongFix />
      <CounterFixed />
      <CounterFlushSync />
      <CounterWithHook />
      <ComplexCounter />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Bug:</strong> React batches state updates, both calls use
            same stale value
          </li>
          <li>
            <strong>Problem:</strong> setCount(count+1) uses count from current
            render (0)
          </li>
          <li>
            <strong>Functional update:</strong> setCount(prev {">"}= prev+1)
            gets latest state
          </li>
          <li>
            <strong>flushSync:</strong> Forces immediate update but breaks
            batching
          </li>
          <li>
            <strong>Best practice:</strong> Always use functional updates for
            sequential updates
          </li>
        </ul>
      </div>
    </div>
  );
}
