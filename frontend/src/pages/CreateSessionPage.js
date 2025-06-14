import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

function CreateSessionPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (question.trim() === '' || filteredOptions.length < 2) {
      alert('Please enter a question and at least two valid options.');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options: filteredOptions }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/session/admin/${data.sessionCode}`);
      } else {
        alert(data.message || 'Failed to create session.');
      }
    } catch (error) {
      console.error('Creation error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Create a New Poll</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter your poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: '80%', marginBottom: '20px' }}
          />
        </div>
        <h3>Options</h3>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addOption} className="secondary-button">Add Option</button>
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}

export default CreateSessionPage;
