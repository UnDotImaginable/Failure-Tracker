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


    const result = "SELECT * FROM users WHERE username = $1 AND email = $2;";

    console.log(req.body);
    const request_val = [data.username, data.email]


    try {
        const ask_question = await pool.query(result, request_val)

        if ((await ask_question).rowCount == 0) {
            res.status(409).json({message: "User does not exist!"})
        }
        else {
            res.status(201).json({
                message: "Found the specified user!",
                id_number: ask_question.rows[0].user_id
            })
        }

    }

    catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });    
    }


});


app.post('/get-failures', async(req, res) => {
    const { user_id } = req.body;

    console.log('POST request to /get-failures received. Data:', user_id);
    
    try {
        const result = await pool.query(
            'SELECT * FROM log_entries WHERE user_id = $1',
            [user_id]
        );

        res.status(201).json({ entries: result.rows })
        console.log(result.rows);
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
            res.status(409).json({message: "User does not exist!"})
        }
        else {
            res.status(201).json({
                message: "Found the specified user!",
                id_number: ask_question.rows[0].user_id
            })
        }
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

app.post('/send_failures', async (req, res) => {
    const { user_id } = req.body;

    console.log('POST request to /get-failures received. Data:', user_id);
    
    try {
        const result = await pool.query(
            'INSERT INTO log_entries (log_entry, user_id) VALUES ($1, $2)',
            [req.body.journal_entry, user_id]
        );

        res.status(201).json({ entries: result.rows })
        console.log(result.rows);
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });    
    }
})

/*
INSERT INTO log_entries (log_entry, user_id)
VALUES (
    'Failed to workout today. Should not have overslept',
    9
);
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