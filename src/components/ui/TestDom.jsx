import React, { useState } from "react";

export default function TestDom() {
  const [count, setCount] = useState(0);
  console.log(count)

  return (
    <>
      <p>Count: {count }</p>
      <div className="flex h-screen justify-center items-center">
        <button onClick={() => setCount(count + 1)} className="bg-slate-900 py-2 px-3 text-white cursor-pointer">Click Me!</button>
      </div>
    </>
  );
}
