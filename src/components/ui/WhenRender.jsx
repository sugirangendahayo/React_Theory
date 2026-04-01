import React, { useState, useEffect } from "react";

export default function WhenRender() {
  const [number, setNumber] = useState(0);

  
  useEffect(() => {
    console.log("useEffect ran! Number:", number);
  }, [number]);

  console.log("App rendered! Number:", number);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Number: {number}</h1>
      <div className="flex gap-6">
        <button
          onClick={() => setNumber(0)}
          className="p-2 rounded-xl bg-cyan-900 text-white cursor-pointer"
        >
          Set number to 0
        </button>
        <button
          onClick={() => setNumber(Math.floor(Math.random() * 10))}
          className="p-2 rounded-xl bg-cyan-900 text-white cursor-pointer"
        >
          Set number to random
        </button>
      </div>
    </div>
  );
}
