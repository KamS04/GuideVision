const express = require('express');
const app = express();

const programsRouter = require('./routes/program');
const universitiesRouter = require('./routes/university');
const pathwaysRouter = require('./routes/pathway');

const config = require('./config');

app.use(express.static('./public'));

if (config.DEBUG) {
    app.use( (req, res, next) => {
        console.log(req.url, req.params, req.query);
        next();
    });
}

app.use('/api/programs', programsRouter);
app.use('/api/universities', universitiesRouter);
app.use('/api/pathways', pathwaysRouter);

app.all('*', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT}...`);
});
