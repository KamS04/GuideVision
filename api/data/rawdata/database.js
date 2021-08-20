const sqlite = require('sqlite3').verbose();
const config = require('../../config');

const { programTableQuery, categoryCourseJunctionTableQuery } = require('../queries/program');
const { universityTableQuery } = require('../queries/university');
const { pathwayTableQuery } = require('../queries/pathway');

const db = new sqlite.Database(config.DB_FILE, () => {
    console.log(`Connected to ${config.DB_FILE}`);
});

// Initial Table Creations
db.exec(universityTableQuery, (err) => {
    if (err) {
        console.error("Universities Table");
        throw err;
    }

    console.log('Universities table created/exists...');
});

db.exec(pathwayTableQuery, (err) => {
    if (err) {
        console.error("Pathways Table");
        throw err;
    }

    console.log('Pathways table created/exists...');
});

db.exec(programTableQuery, (err) => {
    if (err) {
        console.error("Programs Table");
        throw err;
    }

    console.log('Programs table created/exists...');
});

db.exec(categoryCourseJunctionTableQuery, (err) => {
    if (err) {
        console.error('Category-Course-Junction table');
        throw err;
    }

    console.log('Category-Course-Junction table created/exists...');
});

module.exports = db;