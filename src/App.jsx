import React, { useState, useEffect } from "react";

export default function App() {
  const [number, setNumber] = useState(0);

  // Effect to log when it runs
  useEffect(() => {
    console.log("useEffect ran! Number:", number);
  }, [number]);

  console.log("App rendered! Number:", number);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Number: {number}</h1>
      <button onClick={() => setNumber(0)}>
        Set number to 0
      </button>
      <button onClick={() => setNumber(Math.floor(Math.random() * 10))}>
        Set number to random
      </button>
    </div>
  );
}