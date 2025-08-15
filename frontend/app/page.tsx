import UserInterface from "@/components/UserInterface";
import React from "react";

const Home = () => {
  return (
    // Home
    <div className="flex items-center justify-center">
      {/* User Interface */}
      <UserInterface backendName="go" />
    </div>
  );
};

export default Home;
