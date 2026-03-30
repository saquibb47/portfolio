require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ADD THIS LINE BELOW TO FIX THE PHOTO ---
app.use(express.static(path.join(__dirname, '.'))); 

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
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to TiDB Cloud!');
});

// Route to show the website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to check database status
app.get('/status', (req, res) => {
  res.send('Database Connected ✅');
});

// Route to save contact messages
app.post('/contact', (req, res) => {
  const { name, message } = req.body;
  const sql = 'INSERT INTO messages (name, content) VALUES (?, ?)';
  
  connection.query(sql, [name, message], (err) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).send('Error saving to database');
    }
    res.send('Success! Your message is in TiDB.');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});