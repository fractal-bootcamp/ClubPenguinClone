import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface SignUpProps {
  onSignUpSuccess: (playerId: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here, you would typically make an API call to create the user
      // For this example, we'll simulate a successful signup
      const success = await simulateSignUp(userName, password);

      if (success) {
        const newId = uuidv4();
        await initializePlayer(newId, userName);
        onSignUpSuccess(newId);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  // Simulating an API call
  const simulateSignUp = async (username: string, password: string) => {
    // In a real app, this would be an API call to create the user
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  };

  const initializePlayer = async (playerId: string, username: string) => {
    // In a real app, this would be an API call to initialize the player
    console.log(`Initializing player ${username} with ID ${playerId}`);
    // Implement your initializePlayer logic here
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
