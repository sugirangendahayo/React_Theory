import { useRef, useState, useEffect } from "react";

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
        <div className="flex-7">
          <h1 className="text-2xl font-bold">LIST OF POSTS</h1>
          <div className="grid grid-cols-3  gap-4">
            {isDisable ? (
              data.map((post) => (
                <div
                  key={post.id}
                  className="p-3 m-2 shadow hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                >
                  <h1 className="text-red-700 font-semibold">
                    Post: {post.id}
                  </h1>
                  <h1 className="text-xl font-semibold">{post.title}</h1>
                  <p>{post.body}</p>
                </div>
              ))
            ) : (
              <p>No post yet!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
