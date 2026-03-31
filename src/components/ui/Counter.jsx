import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };
  const decrement = () => {
    setCount((prevCount) => prevCount > 0 ? prevCount - 1 : 0);
    
  };
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex  items-center gap-6">
          <button
            className="bg-cyan-800 text-white p-4 rounded-xl cursor-pointer"
            onClick={increment}
          >
            Add
          </button>
          <p className="">{count}</p>
          <button
            className="bg-cyan-800 text-white p-4 rounded-xl cursor-pointer"
            onClick={decrement}
          >
            -
          </button>
        </div>
      </div>
    </>
  );
};

export default Counter;
