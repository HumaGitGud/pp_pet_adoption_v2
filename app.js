const express = require('express');
const mariadb = require('mariadb');

const app = express();
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '123123',
    database: 'pets'
});

async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log("Connected to the database");
        return conn;
    } catch (err) {
        console.log('Error connecting to DB: ' + err)
    }
}

const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Hello, world - server!");
    res.render('home');
});

app.post('/success', async (req, res) => {
    const data = req.body;
    console.log(data);

    // connect to DB
    const conn = await connect();
    await conn.query(
        `INSERT INTO adoptions (pet_type, quantity, color) VALUES
        ('${data.pet_type}', '${data.quantity}', '${data.color}')`
    );
    
    res.render('confirmations', {data : data});
});


app.get('/adoptions', async (req, res) => {
    const conn = await connect();
    const results = await conn.query('SELECT * FROM adoptions ORDER BY date_submitted DESC');
    res.render('adoptions', {adoptions: results});
});

// Tell the app to listen for requests on the designated port
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
});