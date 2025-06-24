// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the 'path' module

const app = express();
const PORT = 5504;

// Use body-parser middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'html_pages' and 'stylesheets' directories
// __dirname is the directory where the currently executing script (server.js) is.
// '../html_pages' means go up one level from server_files, then into html_pages.
app.use(express.static(path.join(__dirname, '../html_pages'))); // For frontpage.html directly
app.use(express.static(path.join(__dirname, '../stylesheets'))); // For styles.css

// Handle GET request for the root URL ('/')
// This will serve frontpage.html when someone visits http://localhost:5503/
app.get('/', (req, res) => {
    console.log('GET request to / received. Serving frontpage.html');
    res.sendFile(path.join(__dirname, '../html_pages', 'frontpage.html'));
});

// Handle POST request for the '/login' endpoint
app.post('/login', (req, res) => {
    const data = req.body;
    console.log('POST request to /login received. Data:', data); // Log the submitted data
    res.send(`<h1 style="text-align: center;
    margin-top: 50vh; transform: translateY(-50%);">
    Form submitted successfully!</h1>`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open your browser to: http://localhost:${PORT}`);
});