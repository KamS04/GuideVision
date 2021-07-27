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

// const apiRouter = express.Router();

app.use('/api', (req, res, next) => {
    console.log(req.url, req.query)
    next()
})

// apiRouter.use('/course', courseRoute);
// apiRouter.use('/university', universityRoute);
// apiRouter.use('/category', categoryRoute)


// app.use('/api', apiRouter);

app.use('/api/course', courseRoute);
app.use('/api/university', universityRoute);
app.use('/api/category', categoryRoute);

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT}...`)
});