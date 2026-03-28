import { useRef, useState, useEffect } from "react";
import Posts from "./pages/Posts";

function App() {
  console.log("App rendered!");
  const [data, setData] = useState([]);

  let ref = useRef(0); 
  const [isDisable, setIsDiable] = useState(false);

  console.log(ref);
  function clicksCounter() {
    let counter = (ref.current = ref.current + 1);
    if (counter === 1) {
      setIsDiable(true);
    }

    console.log(`Clicked ${counter} time`);
  }
  useEffect(() => {
    async function fetchPosts() {
      setTimeout(async () => {
        const response = await fetch(
          "./data/blogs.json",
        );
        console.log(response)
        let myData = await response.json();
        setData(myData);
      }, 5000);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex w-full items-start p-5">
        <div className="flex-3">
          <button
            disabled={isDisable}
            onClick={clicksCounter}
            className={`px-3 py-2 rounded-xl ${isDisable ? " bg-gray-400 text-red-400 cursor-not-allowed" : " bg-black  text-white cursor-pointer "}`}
          >
            {isDisable ? "Disabled!" : "Display posts!"}
          </button>
        </div>
        <Posts data={data} isDisable={isDisable}/>
      </div>
    </>
  );
}

export default App;
