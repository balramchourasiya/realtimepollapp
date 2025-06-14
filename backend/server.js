require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const { nanoid } = require('nanoid');
const PollSession = require('./models/PollSession');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Allow requests from our React app
    methods: ['GET', 'POST'],
  },
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- API Endpoints ---

// Create a new poll session
app.post('/api/sessions', async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: 'Question and at least two options are required.' });
    }

    const newSession = new PollSession({
      sessionCode: nanoid(6).toUpperCase(), // e.g., 'A1B2C3'
      question,
      options: options.map(opt => ({ text: opt, votes: 0 })),
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session details
app.get('/api/sessions/:sessionCode', async (req, res) => {
    try {
        const session = await PollSession.findOne({ sessionCode: req.params.sessionCode });
        if (!session) {
            return res.status(404).json({ message: 'Session not found.' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// --- Socket.IO Real-time Logic ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a session room
  socket.on('joinSession', (sessionCode) => {
    socket.join(sessionCode);
    console.log(`User ${socket.id} joined room ${sessionCode}`);
  });

  // User submits a vote
  socket.on('submitVote', async ({ sessionCode, optionText }) => {
    try {
      const session = await PollSession.findOne({ sessionCode });
      if (session && session.isActive) {
        const option = session.options.find(opt => opt.text === optionText);
        if (option) {
          option.votes += 1;
          await session.save();
          
          // Broadcast updated results to everyone in the room
          io.to(sessionCode).emit('updateResults', session);
        }
      }
    } catch (error) {
      console.error('Error processing vote:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
