import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import ResultsChart from '../components/ResultsChart';

const SOCKET_URL = 'http://localhost:4000';

function UserSessionPage() {
  const { sessionCode } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Check local storage to see if user has already voted in this session
    const votedInSession = localStorage.getItem(`voted_${sessionCode}`);
    if (votedInSession) {
      setHasVoted(true);
    }
    
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    fetch(`http://localhost:4000/api/sessions/${sessionCode}`)
      .then(res => {
          if(!res.ok) throw new Error("Session not found");
          return res.json()
      })
      .then(data => setSessionData(data))
      .catch(err => {
          console.error("Failed to fetch session data", err)
          setSessionData(null); // Explicitly set to null on error
      });

    newSocket.emit('joinSession', sessionCode);

    newSocket.on('updateResults', (updatedSession) => {
      setSessionData(updatedSession);
    });

    return () => newSocket.disconnect();
  }, [sessionCode]);

  const handleVote = (optionText) => {
    if (socket) {
      socket.emit('submitVote', { sessionCode, optionText });
      setHasVoted(true);
      // Store vote in local storage to prevent re-voting on refresh
      localStorage.setItem(`voted_${sessionCode}`, 'true');
    }
  };

  if (!sessionData) {
    return <div className="container"><h1>Joining session... If you see this for a while, the code might be invalid.</h1></div>;
  }
  
  return (
    <div className="container">
      <h1>{sessionData.question}</h1>
      
      {!hasVoted ? (
        <div className="options-list">
          <h3>Cast your vote:</h3>
          {sessionData.options.map((option) => (
            <button
              key={option._id}
              onClick={() => handleVote(option.text)}
              className="vote-button"
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h3>Thank you for voting!</h3>
          <p>Here are the live results:</p>
          <ResultsChart sessionData={sessionData} />
        </div>
      )}
    </div>
  );
}

export default UserSessionPage;
