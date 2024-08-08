import { useState } from "react";
import "./App.css";
import Room from "../components/common/Room";
import Main from "../components/pages/Main";
import "../components/pages/Main.css";
import "../components/common/NavBar.css";
import MapCreator from "./MapCreator";
function App() {
  return (
    <>
      <div>
        {/* <Main /> */}
        {/* <Room /> */}
        <MapCreator />
      </div>
    </>
  );
}

export default App;
