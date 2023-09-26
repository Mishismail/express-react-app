const express = require('./webprojects_server');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Serve the React app
express.app.use(express.express.static(path.join(__dirname, 'client/build')));

// Handle requests that don't match the API routes by serving the React app
express.app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

express.app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
