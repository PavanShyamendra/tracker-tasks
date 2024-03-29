// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');


// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection setup
// mongoose.connect('mongodb://localhost:27017/my_database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// Define routes or middleware here
// For example:
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// })
