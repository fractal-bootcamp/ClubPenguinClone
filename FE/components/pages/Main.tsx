import React, { useState } from "react";
import NavBar from "../common/NavBar";
import image from "../../src/assets/Follower_of_Jheronimus_Bosch_Christ_in_Limbo.jpg";
const Main = () => {
  const [navBarVisible, setNavBarVisible] = useState(false);

  const handleOnClick = () => {
    console.log("clicked!");
    setNavBarVisible(!navBarVisible);
  };

  return (
    <>
      <div className="main-main">
        <div className="save-screen">
          <div className="image-container">
            <img src={image} alt="Background" />
            <div className="title-container">
              <h1 className="main-font" onClick={handleOnClick}>
                Hötel Bösch
              </h1>
              {navBarVisible && (
                <div className="navbar-container">
                  <NavBar />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Main;
