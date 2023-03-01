const express = require('express');

// Import our modular routers for /tips and /feedback
const htmlRouter = require('./htmlRoutes');

const app = express();

app.use('/htmlRoutes', htmlRouter);

module.exports = app;