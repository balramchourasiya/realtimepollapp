import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

function JoinSessionPage() {
  const [sessionCode, setSessionCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sessionCode.trim() === '') return;

    try {
      // Verify the session exists before redirecting
      const response = await fetch(`${API_URL}/api/sessions/${sessionCode.toUpperCase()}`);
      if (response.ok) {
        navigate(`/session/user/${sessionCode.toUpperCase()}`);
      } else {
        alert('Session not found. Please check the code.');
      }
    } catch (error) {
       alert('Error connecting to the server.');
    }
  };

  return (
    <div className="container">
      <h1>Join a Polling Session</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Session Code"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          style={{ textTransform: 'uppercase' }}
        />
        <button type="submit">Join Session</button>
      </form>
    </div>
  );
}

export default JoinSessionPage;
