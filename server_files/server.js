const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const { Pool } = require('pg')

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'User_Information',
    password: 'haLjerFt2zN4vnb',
    port: 5433,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});



const app = express();
const PORT = 5507;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../html_pages'))); 
app.use(express.static(path.join(__dirname, '../stylesheets'))); 


app.get('/', (req, res) => {
    console.log('GET request to / received. Serving frontpage.html');
    res.sendFile(path.join(__dirname, '../html_pages', 'frontpage.html'));

});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_pages', 'signup_page.html'));
})

app.post('/login', async (req, res) => {
    const data = req.body;

    console.log('POST request to /login received. Data:', data); 

    // res.send(`<h1 style="text-align: center;
    // margin-top: 50vh; transform: translateY(-50%);">
    // Form submitted successfully!</h1>`);


    const result = "SELECT * FROM users WHERE username LIKE '%' || $1 || '%';";

    console.log(req.body);
    const request_val = [data.username]


    try {
        const ask_question = await pool.query(result, request_val)

        if ((await ask_question).rowCount == 0) {
            res.status(409).json({message: "User does not exist!"})
        }

        res.status(201).json({message: "Found the specified user!"})
    }

    catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });    
    }


});

app.post('/signup', async (req, res) => {
    const data = req.body;

    console.log('POST request to /login received. Data:', data); 

    const result = "INSERT INTO users (username, email) VALUES ($1, $2) ON CONFLICT (username, email) DO NOTHING RETURNING *"

    console.log(req.body);
    const request_val = [data.username, data.email]


    try {
        const ask_question = await pool.query(result, request_val)

        if ((await ask_question).rowCount == 0) {
            res.status(409).json({message: "User already exists!"})
        }

        res.status(201).json({message: "User created!"})
    }

    catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });    
    }
});


/*
    Postgres query to insert data into users table:

        INSERT INTO users (username, email)
        VALUES ('Veer Gaudani', 'veergaudani@gmail.com')

*/

pool.connect()
    .then(client => {
        return client
            .query('SELECT NOW()')
            .then(res => {
                console.log('Connection successful:', res.rows[0]);
                client.release();
            })
            .catch(err => {
                client.release();
                console.error('Query error:', err.stack);
            });
    })
    .catch(err => {
        console.error('Connection error:', err.stack);
    });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open your browser to: http://localhost:${PORT}`);
});