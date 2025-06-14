import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container">
      <h1>Real-Time Polling App</h1>
      <p>Create a poll as an admin or join a session to vote.</p>
      <div>
        <Link to="/create">
          <button>Create a New Poll (Admin)</button>
        </Link>
        <Link to="/join">
          <button className="secondary-button">Join a Poll (User)</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
