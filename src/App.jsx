import DisplayPosts from "./components/ui/DisplayPosts";
import NavBar from "./components/ui/NavBar";

function App() {
  console.log("App rendered!");
  return (
    <>
      <NavBar />
      <DisplayPosts />
    </>
  );
}

export default App;
