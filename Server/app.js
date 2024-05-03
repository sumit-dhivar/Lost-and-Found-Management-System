const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: '192.168.45.160',
    user: 'root',
    password: 'Pass@123',
    database: 'lostandfounditems'
});
const pool = mysql.createPool({
  host: '192.168.45.160',
  user: 'root',
  password: 'Pass@123',
  database: 'lostandfounditems',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
connection.connect(err => {
    if (err) console.log('Error while connecting to mysql')
    else console.log('Connected to mysql successfully')
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

//Adding Found Item
app.post('/addItem', (req, res) => {
    const newItem = req.body;
    console.log(req.body)
    let query = 'insert into items (type, name, description, contact, location) ' +
        'values (?, ?, ?, ?, ?)'

    let values = [newItem.type, newItem.name, newItem.description, newItem.contact, newItem.location]

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting item:', error);
            res.status(500).send('Error inserting item');
        } else {
            console.log('Item added successfully:', results);
            res.status(200).send('Item added successfully');
        }
    });
})

app.get('/getFoundItems', (req, res) => {
  connection.query('SELECT * FROM items WHERE type = \'found\'', (err, results) => {
    if (err) {
      console.error('Error fetching found items:', err);
      res.status(500).send('Error fetching found items');
    } else {
      console.log('Found items:', results);
      res.send(results);
    }
  });
});

app.get('/getLostItems', (req, res) => {
  connection.query('SELECT * FROM items WHERE type = \'lost\'', (err, results) => {
    if (err) {
      console.error('Error fetching lost items:', err);
      res.status(500).send('Error fetching lost items');
    } else {
      console.log('Lost items:', results);
      res.send(results);
    }
  });
});

// Register endpoint
app.post('/register', (req, res) => {
    const { name, email, password, age, number } = req.body;
  
    const sql = 'INSERT INTO UserInfo (Username, Email, Password, Age, ContactNumber) VALUES (?, ?, ?, ?, ?)';
    const values = [name, email, password, age, number];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
      } else {
        console.log('User registered successfully');
        res.status(200).send('User registered successfully');
      }
    });
  });
  // Login endpoint
  app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = 'SELECT * FROM UserInfo WHERE Email = ? AND Password = ?';
    connection.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query: ', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (result.length > 0) {
                res.status(200).send('Login successful!');
            } else {
                res.status(401).send('Invalid email or password');
            }
        }
    });
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
    const poolConnection = await pool.promise().getConnection();
    const [results] = await poolConnection.execute('SELECT * FROM items WHERE name LIKE ? AND type LIKE "f%"', [`%${searchTerm}%`]);
    console.log('Search results:', results);
    poolConnection.release();
    return results;
  } catch (error) {
    console.error('Error searching items in MySQL:', error);
    throw error;
  }
}

// Add a new route for deleting an item
app.delete('/deleteItem/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  const sql = 'DELETE FROM items WHERE id = ?';

  connection.query(sql, [itemId], (err, result) => {
      if (err) {
          console.error('Error executing MySQL query: ', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.status(200).send('Item deleted successfully');
      }
  });
});

// Add a new route for updating an item
app.put('/updateItem/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  const updatedItem = req.body; // Assuming the request body contains the updated item data
  const sql = 'UPDATE items SET type = ?, name = ?, description = ?, contact = ?, location = ? WHERE id = ?';

  const values = [
      updatedItem.type,
      updatedItem.name,
      updatedItem.description,
      updatedItem.contact,
      updatedItem.location,
      itemId
  ];

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error executing MySQL query: ', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.status(200).send('Item updated successfully');
      }
  });
});

app.listen(3000, () => {
    console.log(`App listening on port 3000`);
})
