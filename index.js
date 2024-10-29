const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'std',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/sign.html');
});

app.post('/signup', (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send('All fields are required.');
    }

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.send('Error creating account. Try a different email.');
        } else {
            res.send('Account created successfully! <a href="/">Login here</a>');
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) {
            res.send('Username not found.');
        } else {
            const user = results[0];

            if (password === user.password) {
                res.send('Login successful!');
            } else {
                res.send('Incorrect password.');
            }
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
