const express = require('express');
const app = express();

const courseRoute = require('./routes/course');
const universityRoute = require('./routes/university');
const categoryRoute = require('./routes/category');

const config = require('./config');

app.use(express.static('./public'));


app.get('/', (req, res) => {
    res.json({ success: true, msg: 'Hello there.'});
});

app.get('/course', courseRoute);
app.get('/university', universityRoute);
app.get('/category', categoryRoute);

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT}...`)
});