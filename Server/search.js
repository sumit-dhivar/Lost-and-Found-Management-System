const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Create a connection pool to the database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Pass@123',
  database: 'lostandfounditems',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/search', async (req, res) => {
  const searchTerm = req.body.searchTerm;

  try {
    const results = await searchItemsInMySQL(searchTerm);
    res.json(results);
  } catch (error) {
    console.error('Error handling search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function searchItemsInMySQL(searchTerm) {
  try {
    const connection = await pool.getConnection();
    const sql = 'SELECT * FROM items WHERE name LIKE ? AND type LIKE "f%"';    
    const [results] = await connection.execute(sql, [`%${searchTerm}%`]);
    connection.release();
    console.log('Search results:', results);
    return results;
  } catch (error) {
    console.error('Error searching items in MySQL:', error);

    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
