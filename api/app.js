const express = require('express');
const app = express();

const config = require('./config');

app.use(express.static('./public'));

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT}...`)
});