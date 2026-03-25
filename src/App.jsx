import { useRef, useState } from "react";

function App() {
  console.log("App rendered!")
  let ref = useRef(0);
  const [isDisable, setIsDiable] = useState(false);

  console.log(ref);
  function clicksCounter(e) {
  e.preventDefault()
    let counter = (ref.current = ref.current + 1);
    if (counter === 5) {
      setIsDiable(true);
    }

    console.log(`Clicked ${counter} time`);
  }

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <form action="">
          <button
            disabled={isDisable}
            onClick={clicksCounter}
            className={`px-3 py-2 rounded-xl ${isDisable ? " bg-gray-400 text-red-400 cursor-not-allowed" : " bg-black  text-white cursor-pointer "}`}
          >
            {isDisable ? "Disabled!" : "Get data!"}
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
