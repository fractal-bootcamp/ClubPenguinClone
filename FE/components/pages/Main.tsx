import React, { useState } from "react";
import NavBar from "../common/NavBar";
import image from "../../src/assets/Follower_of_Jheronimus_Bosch_Christ_in_Limbo.jpg";
import Garden from "../pages/Garden";
import SignUp from "../common/Sign-up/SignUp";
import LogIn from "../common/Sign-up/LogIn";

const Main: React.FC = () => {
  const [navBarVisible, setNavBarVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<JSX.Element | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const handleOnClick = () => {
    setNavBarVisible(!navBarVisible);
  };

  const handleRoomChange = (room: JSX.Element) => {
    setCurrentRoom(room);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogIn(false);
  };

  const handleLogInClick = () => {
    setShowLogIn(true);
    setShowSignUp(false);
  };

  const handleSignUpSuccess = (newId: string) => {
    setPlayerId(newId);
    setShowSignUp(false);
    // Optionally handle room change here
  };

  const handleLogInSuccess = (playerId: string) => {
    setPlayerId(playerId);
    setShowLogIn(false);
    // Optionally handle room change here
  };

  return (
    <div className="main-container">
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
        <div className="overlay-container">
          {playerId ? (
            <div className="room-selector">
              <button
                onClick={() =>
                  handleRoomChange(
                    <Garden width={"760"} height={"960"} playerId={playerId} />
                  )
                }
              >
                Garden
              </button>
              {/* Uncomment if Room component is used
              <button onClick={() => handleRoomChange(<Room width={"760"} height={"960"} playerId={playerId} />)}>
                Room
              </button>
              */}
            </div>
          ) : (
            <div className="auth-selector">
              <button onClick={handleSignUpClick}>Sign Up</button>
              <button onClick={handleLogInClick}>Log In</button>
            </div>
          )}
          <div className="room-display">{currentRoom}</div>
          {showSignUp && <SignUp onSignUpSuccess={handleSignUpSuccess} />}
          {showLogIn && <LogIn onLogInSuccess={handleLogInSuccess} />}
        </div>
      </div>
    </div>
  );
};

export default Main;
