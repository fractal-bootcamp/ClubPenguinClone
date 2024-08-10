import React, { useState } from "react";
import SignUp from "./Sign-up/SignUp";
import Login from "./Sign-up/LogIn";

const NavBar: React.FC = () => {
  // State to manage which form to display
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);

  return (
    <nav>
      <div className="nav-container">
        <h3
          onClick={() => {
            setShowSignUp(false);
            setShowLogin(false);
          }}
        >
          LogIn / SignUp
        </h3>
        <h3>Shop</h3>
        <h3>About</h3>
      </div>
      <div className="form-buttons">
        <button
          onClick={() => {
            setShowSignUp(true);
            setShowLogin(false);
          }}
        >
          Sign Up
        </button>
        <button
          onClick={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        >
          Log In
        </button>
      </div>
      <div className="form-container">
        {showSignUp && <SignUp />}
        {showLogin && <Login />}
      </div>
    </nav>
  );
};

export default NavBar;
