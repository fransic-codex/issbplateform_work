const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
// Build allowed origins from environment + defaults
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173'
];

// Support both CORS_ORIGIN and FRONTEND_URL env variable names
const corsEnv = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;
if (corsEnv) {
  corsEnv.split(',').forEach(url => {
    const trimmed = url.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

console.log('[CORS] Allowed origins:', allowedOrigins);

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In production, also allow any *.railway.app origin
    if (origin.endsWith('.railway.app')) {
      return callback(null, true);
    }
    
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(new Error('CORS not allowed'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Apply CORS to all routes
app.use(corsMiddleware);

// Explicit OPTIONS handling for preflight
app.options('*', corsMiddleware);

console.log('[CORS] Initialized');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const mongoUri = process.env.MONGODB_URI || process.env.RAILWAY_MONGODB_URI;
console.log('Connecting to MongoDB:', mongoUri ? mongoUri.substring(0, 30) + '...' : 'No URI provided - check MONGODB_URI env variable');

if (!mongoUri) {
  console.error('FATAL: MONGODB_URI environment variable is not set!');
}

// Connect to MongoDB but DON'T exit if it fails - server must stay alive
mongoose.connect(mongoUri || 'invalid')
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    console.error('Server will continue running - fix MONGODB_URI in Railway environment variables');
  });

// Middleware: block API requests if DB not connected
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database not connected. Please check MONGODB_URI environment variable in Railway.' 
    });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/results', require('./routes/results'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error Handler - ensure CORS headers are present even on errors
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // If it's a CORS error, send a clear response
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ message: 'CORS: Origin not allowed' });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
});
