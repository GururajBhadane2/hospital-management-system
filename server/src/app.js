const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Fallback route
app.get('/', (req, res) => {
  res.json({
    message: 'ApexCare Hospital Management System API is running',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

module.exports = app;
