import { useState } from "react";
import "./App.css";
import Room from "../components/common/Room";
import Main from "../components/pages/Main";
import "../components/pages/Main.css";
import "../components/common/NavBar.css";
import Garden from "../components/pages/Garden";
function App() {
  return (
    <>
      <div>
        {/* <Main /> */}
        <Room />
        {/* <Garden width={"900"} height={"1200"} /> */}
      </div>
    </>
  );
}

export default App;
