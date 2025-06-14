import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import QRCode from 'qrcode.react';
import ResultsChart from '../components/ResultsChart';

const SOCKET_URL = 'http://localhost:4000';

function AdminSessionPage() {
  const { sessionCode } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const joinUrl = `${window.location.origin}/session/user/${sessionCode}`;

  useEffect(() => {
    // Connect to the socket server
    const socket = io(SOCKET_URL);

    // Fetch initial data
    fetch(`http://localhost:4000/api/sessions/${sessionCode}`)
        .then(res => res.json())
        .then(data => setSessionData(data))
        .catch(err => console.error("Failed to fetch session data", err));


    // Join the specific session room
    socket.emit('joinSession', sessionCode);

    // Listen for real-time updates
    socket.on('updateResults', (updatedSession) => {
      setSessionData(updatedSession);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [sessionCode]);

  if (!sessionData) {
    return <div className="container"><h1>Loading session...</h1></div>;
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <h2>Poll: {sessionData.question}</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0' }}>
        <div>
          <h3>Share this code with your audience:</h3>
          <p className="code-display">{sessionCode}</p>
          <p>Or share this link: <a href={joinUrl} target="_blank" rel="noopener noreferrer">{joinUrl}</a></p>
        </div>
        <div>
           <h3>Scan QR Code to Join</h3>
           <QRCode value={joinUrl} size={150} />
        </div>
      </div>
      
      <hr />
      
      <h2>Live Results</h2>
      <ResultsChart sessionData={sessionData} />
    </div>
  );
}

export default AdminSessionPage;
