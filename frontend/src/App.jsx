import React, { useEffect } from "react";
import Home from "./pages/Home";
import Menu from "./pages/Menu";



function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      {/* <Home /> */}
      <Menu />

      
    </>
  );
}

export default App;
