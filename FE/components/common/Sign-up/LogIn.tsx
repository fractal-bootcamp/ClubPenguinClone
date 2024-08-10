import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface LogInProps {
  onLogInSuccess: (playerId: string) => void;
}

const LogIn: React.FC<LogInProps> = ({ onLogInSuccess }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate a successful login
      const success = await simulateLogIn(userName, password);

      if (success) {
        // Assuming the playerId is retrieved or generated after a successful login
        const playerId = uuidv4(); // Replace this with actual player ID retrieval
        await initializePlayer(playerId, userName);
        onLogInSuccess(playerId); // Call the prop function with the player ID
      }
    } catch (error) {
      console.error("Error during log in:", error);
    }
  };

  // Simulating an API call
  const simulateLogIn = async (username: string, password: string) => {
    // In a real app, this would be an API call to verify the user's credentials
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
      <h2>Log In</h2>
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
      <button type="submit">Log In</button>
    </form>
  );
};

export default LogIn;
