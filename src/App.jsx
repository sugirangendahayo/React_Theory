import { useRef, useState, useEffect } from "react";

function App() {
  console.log("App rendered!");
  const [data, setData] = useState([]);

  let ref = useRef(0);
  const [isDisable, setIsDiable] = useState(false);

  console.log(ref);
  function clicksCounter(e) {
    e.preventDefault();
    let counter = (ref.current = ref.current + 1);
    if (counter === 5) {
      setIsDiable(true);
    }

    console.log(`Clicked ${counter} time`);
  }
  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );
      let myData = await response.json();
      setData(myData);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div>
          <button
            disabled={isDisable}
            onClick={clicksCounter}
            className={`px-3 py-2 rounded-xl ${isDisable ? " bg-gray-400 text-red-400 cursor-not-allowed" : " bg-black  text-white cursor-pointer "}`}
          >
            {isDisable ? "Disabled!" : "Get data!"}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
