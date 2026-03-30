require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// Connect to TiDB Cloud
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to TiDB: ' + err.stack);
    return;
  }
  console.log('Connected to TiDB Cloud!');
});

// This route sends the HTML file to your browser
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// This is a special "API" route for the HTML to check the status
app.get('/status', (req, res) => {
  res.send('Database is connected and Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});