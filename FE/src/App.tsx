import { useState } from "react";
import "./App.css";
import Room from "../components/common/Room";
import Main from "../components/pages/Main";
import "../components/pages/Main.css";
import "../components/common/NavBar.css";
function App() {
  return (
    <>
      <div>
        {/* <Main /> */}
        <Room />
      </div>
    </>
  );
}

export default App;
