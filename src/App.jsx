import React from "react";
// import Calculator from "./components/ui/Calculator";

// import Counter from "./components/ui/Counter";

function App() {
  const [numbers, setNumbers] = React.useState([1, 2, 3]);
  const updatedNumbers = [...numbers, 4];

  return (
    <>
      {updatedNumbers.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </>
  );
}

export default App;
