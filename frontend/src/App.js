import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateSessionPage from './pages/CreateSessionPage';
import JoinSessionPage from './pages/JoinSessionPage';
import AdminSessionPage from './pages/AdminSessionPage';
import UserSessionPage from './pages/UserSessionPage';
import './index.css'; // Use index.css for global styles

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateSessionPage />} />
          <Route path="/join" element={<JoinSessionPage />} />
          <Route path="/session/admin/:sessionCode" element={<AdminSessionPage />} />
          <Route path="/session/user/:sessionCode" element={<UserSessionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
