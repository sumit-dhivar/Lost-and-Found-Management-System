const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sumit8983',
  database: 'lostandfounditems',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.post('/addItem', (req, res) => {
  const newItem = req.body;

  const sql = 'INSERT INTO fitems (type, name, description, contact, location) VALUES (?, ?, ?, ?, ?)';
  const values = [newItem.type, newItem.name, newItem.description, newItem.contact, newItem.location];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding item to the database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Item added successfully to the database');
      res.status(200).send('Item added successfully');
    }
  });
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
