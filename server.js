require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');





const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/threads', require('./routes/threadRoutes'));
app.use('/api/comment', require('./routes/commentRoutes'));
app.use('/api/replies', require('./routes/replyroutes'));
app.use('/api/search', require('./routes/searchRoutes'));








// Database connect
connectDB();

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
