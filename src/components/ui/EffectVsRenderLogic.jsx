import React from "react";

/*
## Questions:
1. Why is useEffect unnecessary here?
2. Rewrite this in a more idiomatic React way

## Problem Analysis:
- The filtering logic is synchronous and depends only on props
- useEffect creates an additional render cycle
- First render: filtered is [], then useEffect updates filtered
- Second render: filtered has the correct values
- This is inefficient and violates React's declarative principles
- Filtering should happen during render, not in an effect
*/

// Step 1: Initial buggy implementation (unnecessary useEffect)
function FilteredListBuggy({ items, query }) {
  const [filtered, setFiltered] = React.useState([]);

  React.useEffect(() => {
    // UNNECESSARY: useEffect for synchronous computation
    setFiltered(items.filter((item) => item.includes(query)));
  }, [items, query]);

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">
        Buggy FilteredList (Unnecessary useEffect)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Query: "{query}"</p>
        <p>Items: {items.length}</p>
        <p>Filtered: {filtered.length}</p>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-xs text-red-500">
        ❌ Unnecessary useEffect causes extra render!
      </p>
    </div>
  );
}

// Step 2: Wrong fix - useMemo when not needed
function FilteredListWrongFix({ items, query }) {
  // WRONG: useMemo for simple filtering that's not expensive
  const filtered = React.useMemo(() => {
    return items.filter((item) => item.includes(query));
  }, [items, query]);

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">
        Wrong Fix (Unnecessary useMemo)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Query: "{query}"</p>
        <p>Items: {items.length}</p>
        <p>Filtered: {filtered.length}</p>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-xs text-yellow-600">
        ⚠️ useMemo is overkill for simple filtering!
      </p>
    </div>
  );
}

// Step 3: Correct fix - compute during render
function FilteredListFixed({ items, query }) {
  // CORRECT: Compute directly during render
  const filtered = items.filter((item) => item.includes(query));

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">
        Fixed FilteredList (Render Logic)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Query: "{query}"</p>
        <p>Items: {items.length}</p>
        <p>Filtered: {filtered.length}</p>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-xs text-green-600">
        ✅ Correct! Compute during render, no extra state needed.
      </p>
    </div>
  );
}

// Step 4: When useMemo IS appropriate (expensive computation)
function ExpensiveFilteredList({ items, query }) {
  // CORRECT: useMemo for expensive computation
  const filtered = React.useMemo(() => {
    console.log("Expensive filter running...");
    // Simulate expensive filtering operation
    let result = items;
    for (let i = 0; i < 1000; i++) {
      result = result.filter((item) => item.includes(query));
    }
    return result;
  }, [items, query]);

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">
        Expensive FilteredList (useMemo Appropriate)
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Query: "{query}"</p>
        <p>Items: {items.length}</p>
        <p>Filtered: {filtered.length}</p>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-xs text-blue-600">
        ✅ Correct! useMemo for expensive computation.
      </p>
    </div>
  );
}

// Step 5: Custom hook for filtering logic
function useFilteredList(
  items,
  query,
  filterFn = (item, q) => item.includes(q),
) {
  // Compute during render, no useMemo needed for simple cases
  const filtered = items.filter((item) => filterFn(item, query));

  return {
    filtered,
    count: filtered.length,
    isEmpty: filtered.length === 0,
    hasResults: filtered.length > 0,
  };
}

function FilteredListWithHook({ items, query }) {
  const { filtered, count, isEmpty, hasResults } = useFilteredList(
    items,
    query,
  );

  return (
    <div className="p-4 border border-purple-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-purple-600 mb-2">
        FilteredList with Custom Hook
      </h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Query: "{query}"</p>
        <p>Items: {items.length}</p>
        <p>Filtered: {count}</p>
        <p>Is Empty: {isEmpty ? "Yes" : "No"}</p>
        <p>Has Results: {hasResults ? "Yes" : "No"}</p>
      </div>
      {hasResults ? (
        <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
          {filtered.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No results found</p>
      )}
      <p className="text-xs text-purple-600">
        ✅ Clean: Custom hook encapsulates filtering logic.
      </p>
    </div>
  );
}

// Step 3: Complex example with multiple filters
function useAdvancedFilter(items, filters) {
  const filtered = React.useMemo(() => {
    let result = items;

    // Apply multiple filters
    if (filters.query) {
      result = result.filter((item) =>
        item.toLowerCase().includes(filters.query.toLowerCase()),
      );
    }

    if (filters.minLength) {
      result = result.filter((item) => item.length >= filters.minLength);
    }

    if (filters.maxLength) {
      result = result.filter((item) => item.length <= filters.maxLength);
    }

    if (filters.startsWith) {
      result = result.filter((item) =>
        item.toLowerCase().startsWith(filters.startsWith.toLowerCase()),
      );
    }

    return result;
  }, [
    items,
    filters.query,
    filters.minLength,
    filters.maxLength,
    filters.startsWith,
  ]);

  return {
    filtered,
    count: filtered.length,
    isEmpty: filtered.length === 0,
    hasResults: filtered.length > 0,
    originalCount: items.length,
  };
}

function AdvancedFilteredList({ items }) {
  const [filters, setFilters] = React.useState({
    query: "",
    minLength: 0,
    maxLength: Infinity,
    startsWith: "",
  });

  const { filtered, count, hasResults, originalCount } = useAdvancedFilter(
    items,
    filters,
  );

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 border border-indigo-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">
        Advanced FilteredList (Multiple Filters)
      </h3>

      <div className="space-y-2 mb-3">
        <div>
          <label className="text-sm font-medium">Query:</label>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="ml-2 px-2 py-1 border rounded text-sm"
            placeholder="Filter text..."
          />
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="text-sm font-medium">Min Length:</label>
            <input
              type="number"
              value={filters.minLength}
              onChange={(e) =>
                updateFilter("minLength", parseInt(e.target.value) || 0)
              }
              className="ml-2 px-2 py-1 border rounded text-sm w-16"
              min="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Max Length:</label>
            <input
              type="number"
              value={filters.maxLength === Infinity ? "" : filters.maxLength}
              onChange={(e) =>
                updateFilter("maxLength", parseInt(e.target.value) || Infinity)
              }
              className="ml-2 px-2 py-1 border rounded text-sm w-16"
              min="1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Starts With:</label>
            <input
              type="text"
              value={filters.startsWith}
              onChange={(e) => updateFilter("startsWith", e.target.value)}
              className="ml-2 px-2 py-1 border rounded text-sm"
              placeholder="Prefix..."
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        <p>Original: {originalCount} items</p>
        <p>Filtered: {count} items</p>
        <p>
          Filters applied:{" "}
          {
            Object.values(filters).filter(
              (v) => v !== "" && v !== 0 && v !== Infinity,
            ).length
          }
        </p>
      </div>

      {hasResults ? (
        <ul className="list-disc list-inside text-sm text-gray-700 mb-2 max-h-32 overflow-y-auto">
          {filtered.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No results found</p>
      )}

      <p className="text-xs text-indigo-600">
        ✅ Advanced: useMemo for complex filtering with multiple criteria
      </p>
    </div>
  );
}

export default function EffectVsRenderLogic() {
  const [query, setQuery] = React.useState("");
  const [items] = React.useState([
    "apple",
    "banana",
    "orange",
    "grape",
    "strawberry",
    "blueberry",
    "watermelon",
    "pineapple",
    "mango",
    "kiwi",
  ]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Effect vs Render Logic
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Why is useEffect unnecessary here?</li>
          <li>Rewrite this in a more idiomatic React way</li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Filter Query:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 px-2 py-1 border rounded"
            placeholder="Type to filter..."
          />
        </label>
        <p className="text-xs text-gray-500">
          Try typing to see how different implementations behave
        </p>
      </div>

      <FilteredListBuggy items={items} query={query} />
      <FilteredListWrongFix items={items} query={query} />
      <FilteredListFixed items={items} query={query} />
      <ExpensiveFilteredList items={items} query={query} />
      <FilteredListWithHook items={items} query={query} />
      <PerformanceFilteredList items={items} query={query} />
      <AdvancedFilteredList items={items} />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Problem:</strong> useEffect for synchronous computation
            causes extra render
          </li>
          <li>
            <strong>Issue:</strong> First render shows empty, then useEffect
            triggers second render
          </li>
          <li>
            <strong>Solution:</strong> Compute directly during render
          </li>
          <li>
            <strong>useMemo:</strong> Only for expensive computations, not
            simple filtering
          </li>
          <li>
            <strong>Performance:</strong> Render computation is more efficient
            than useEffect
          </li>
          <li>
            <strong>Best practice:</strong> Effects for side effects, render for
            computation
          </li>
        </ul>
      </div>
    </div>
  );
}
