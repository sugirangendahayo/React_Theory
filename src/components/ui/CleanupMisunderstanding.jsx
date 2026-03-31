import React from "react";

/*
## Questions:
1. Why doesn't cleanup work?
2. Fix the issue properly

## Problem Analysis:
- The cleanup function tries to remove a different event listener than was added
- addEventListener receives an anonymous function
- removeEventListener receives a different anonymous function (even if same code)
- Functions are compared by reference, not by value
- The cleanup function does nothing because no matching listener is found
*/

// Step 1: Initial buggy implementation
function WindowSizeBuggy() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    // BUG: Adding anonymous function as event listener
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    return () => {
      // BUG: Trying to remove different anonymous function
      window.removeEventListener("resize", () => {
        setWidth(window.innerWidth);
      });
    };
  }, []);

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">
        Buggy WindowSize (Cleanup Doesn't Work)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Window Width: {width}px</p>
      </div>
      <p className="text-xs text-red-500">
        ❌ Cleanup fails - different function references
      </p>
    </div>
  );
}

// Step 2: Wrong fix - no cleanup at all
function WindowSizeWrongFix() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
    // WRONG: No cleanup function - memory leak!
  }, []);

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        Wrong Fix (No Cleanup)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Window Width: {width}px</p>
      </div>
      <p className="text-xs text-yellow-600">
        ⚠️ Memory leak - no cleanup at all
      </p>
    </div>
  );
}

// Step 3: Correct fix - named function
function WindowSizeFixed() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    // CORRECT: Use named function for both add and remove
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">
        Fixed WindowSize (Named Function)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Window Width: {width}px</p>
      </div>
      <p className="text-xs text-green-600">
        ✅ Correct: Same function reference for add/remove
      </p>
    </div>
  );
}

// Step 4: Alternative fix - useCallback
function WindowSizeCallback() {
  const [width, setWidth] = React.useState(window.innerWidth);

  // CORRECT: Use useCallback to memoize function
  const handleResize = React.useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        Fixed WindowSize (useCallback)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Window Width: {width}px</p>
      </div>
      <p className="text-xs text-blue-600">
        ✅ Correct: useCallback ensures stable function reference
      </p>
    </div>
  );
}

// Step 5: Custom hook solution
function useWindowSize() {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width, height };
}

function WindowSizeWithHook() {
  const { width, height } = useWindowSize();

  return (
    <div className="p-4 border border-purple-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-purple-600 mb-2">
        WindowSize with Custom Hook
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Window Width: {width}px</p>
        <p>Window Height: {height}px</p>
      </div>
      <p className="text-xs text-purple-600">
        ✅ Clean: Reusable custom hook with proper cleanup
      </p>
    </div>
  );
}

// Step 6: Advanced example with multiple event listeners
function WindowSizeAdvanced() {
  const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [orientation, setOrientation] = React.useState(
    window.innerWidth > window.innerHeight ? "landscape" : "portrait",
  );

  React.useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setSize({ width: newWidth, height: newHeight });
      setOrientation(newWidth > newHeight ? "landscape" : "portrait");
    };

    const handleOrientationChange = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait",
      );
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return (
    <div className="p-4 border border-orange-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-orange-600 mb-2">
        Advanced WindowSize (Multiple Listeners)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Window Width: {size.width}px</p>
        <p>Window Height: {size.height}px</p>
        <p>Orientation: {orientation}</p>
      </div>
      <p className="text-xs text-orange-600">
        ✅ Advanced: Multiple event listeners with proper cleanup
      </p>
    </div>
  );
}

export default function CleanupMisunderstanding() {
  const [mounted, setMounted] = React.useState(true);

  const toggleMount = () => {
    setMounted(!mounted);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Cleanup Misunderstanding Bug
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Why doesn't cleanup work?</li>
          <li>Fix the issue properly</li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={toggleMount}
          className={`px-4 py-2 rounded ${
            mounted
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {mounted ? "Unmount Components" : "Mount Components"}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Resize window and toggle mount/unmount to test cleanup
        </p>
      </div>

      {mounted && (
        <>
          <WindowSizeBuggy />
          <WindowSizeWrongFix />
          <WindowSizeFixed />
          <WindowSizeCallback />
          <WindowSizeWithHook />
          <WindowSizeAdvanced />
        </>
      )}

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Bug:</strong> Anonymous functions have different references
          </li>
          <li>
            <strong>Problem:</strong> removeEventListener can't find matching
            listener
          </li>
          <li>
            <strong>Wrong fix:</strong> No cleanup causes memory leaks
          </li>
          <li>
            <strong>Correct fix:</strong> Use named function or useCallback
          </li>
          <li>
            <strong>Best practice:</strong> Extract into custom hooks
          </li>
        </ul>
      </div>
    </div>
  );
}
