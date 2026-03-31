import React from 'react';

/*
## Questions:
1. Why is this an anti-pattern?
2. Refactor to a better approach

## Problem Analysis:
- The 'total' state is derived from 'items' props
- This creates redundant state that can get out of sync
- Every time items change, we have to update total state
- This adds unnecessary complexity and potential bugs
- Derived state should be calculated on render, not stored
*/

// Step 1: Initial buggy implementation (anti-pattern)
function CartBuggy({ items }) {
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    // ANTI-PATTERN: Storing derived state
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]);

  return (
    <div className="p-4 border border-red-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">Buggy Cart (Derived State Anti-pattern)</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Items: {items.length}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <p className="text-xs text-red-500">
        ❌ Anti-pattern: Storing derived state in useState
      </p>
    </div>
  );
}

// Step 2: Wrong fix - memoization without addressing root issue
function CartWrongFix({ items }) {
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  }, [items]);

  return (
    <div className="p-4 border border-yellow-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-yellow-600 mb-2">Wrong Fix (Still Anti-pattern)</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Items: {items.length}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <p className="text-xs text-yellow-600">
        ⚠️ Still storing derived state, just more complex
      </p>
    </div>
  );
}

// Step 3: Correct fix - calculate on render
function CartFixed({ items }) {
  // CORRECT: Calculate derived value on each render
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-4 border border-green-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">Fixed Cart (Calculate on Render)</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Items: {items.length}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <p className="text-xs text-green-600">
        ✅ Correct: Calculate derived value, don't store it
      </p>
    </div>
  );
}

// Step 4: Optimized fix with useMemo for expensive calculations
function CartOptimized({ items }) {
  // OPTIMIZED: Use useMemo for expensive calculations
  const total = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return (
    <div className="p-4 border border-blue-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Optimized Cart (useMemo)</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Items: {items.length}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <p className="text-xs text-blue-600">
        ✅ Optimized: useMemo for expensive calculations
      </p>
    </div>
  );
}

// Step 5: Custom hook for derived state logic
function useCartTotal(items) {
  // Extract derived logic into reusable hook
  const total = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  const itemCount = React.useMemo(() => {
    return items.length;
  }, [items]);

  const averagePrice = React.useMemo(() => {
    return itemCount > 0 ? total / itemCount : 0;
  }, [total, itemCount]);

  return { total, itemCount, averagePrice };
}

function CartWithHook({ items }) {
  const { total, itemCount, averagePrice } = useCartTotal(items);

  return (
    <div className="p-4 border border-purple-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-purple-600 mb-2">Cart with Custom Hook</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Items: {itemCount}</p>
        <p>Total: ${total.toFixed(2)}</p>
        <p>Average: ${averagePrice.toFixed(2)}</p>
      </div>
      <p className="text-xs text-purple-600">
        ✅ Clean: Custom hook for derived state logic
      </p>
    </div>
  );
}

// Step 6: Complex example with multiple derived values
function CartComplex({ items, discount = 0, tax = 0.1 }) {
  const subtotal = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  const discountAmount = React.useMemo(() => {
    return subtotal * (discount / 100);
  }, [subtotal, discount]);

  const afterDiscount = React.useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  const taxAmount = React.useMemo(() => {
    return afterDiscount * tax;
  }, [afterDiscount, tax]);

  const total = React.useMemo(() => {
    return afterDiscount + taxAmount;
  }, [afterDiscount, taxAmount]);

  return (
    <div className="p-4 border border-orange-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-orange-600 mb-2">Complex Cart (Multiple Derived Values)</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>Items: {items.length}</p>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Discount ({discount}%): -${discountAmount.toFixed(2)}</p>
        <p>After discount: ${afterDiscount.toFixed(2)}</p>
        <p>Tax ({(tax * 100).toFixed(0)}%): ${taxAmount.toFixed(2)}</p>
        <p><strong>Total: ${total.toFixed(2)}</strong></p>
      </div>
      <p className="text-xs text-orange-600">
        ✅ Complex: Multiple derived values with proper memoization
      </p>
    </div>
  );
}

export default function IncorrectDerivedState() {
  const [items, setItems] = React.useState([
    { id: 1, name: 'Apple', price: 1.99 },
    { id: 2, name: 'Banana', price: 0.99 },
    { id: 3, name: 'Orange', price: 2.49 }
  ]);

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    const newItem = {
      id: newId,
      name: `Item ${newId}`,
      price: Math.random() * 10 + 1
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Incorrect Derived State Anti-pattern</h2>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Questions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Why is this an anti-pattern?</li>
          <li>Refactor to a better approach</li>
        </ol>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Cart Items:</h3>
        <div className="space-y-2 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="text-sm">{item.name} - ${item.price.toFixed(2)}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Random Item
        </button>
      </div>

      <CartBuggy items={items} />
      <CartWrongFix items={items} />
      <CartFixed items={items} />
      <CartOptimized items={items} />
      <CartWithHook items={items} />
      <CartComplex items={items} discount={10} tax={0.08} />

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Explanation:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>Anti-pattern:</strong> Storing derived state in useState + useEffect</li>
          <li><strong>Problems:</strong> Redundant state, synchronization issues, complexity</li>
          <li><strong>Correct approach:</strong> Calculate derived values on render</li>
          <li><strong>Optimization:</strong> Use useMemo for expensive calculations</li>
          <li><strong>Best practice:</strong> Extract logic into custom hooks</li>
        </ul>
      </div>
    </div>
  );
}
