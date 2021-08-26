const queries = require('../queries/university');
const db = require('./database');

const getAllUniversities = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectAllUniversities, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getUniversity = (id) => {
    return new Promise( (resolve, reject) => {
        db.get(queries.selectUniversityById, id, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

const searchUniversity = (universityQuery, limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.searchUniversity, [`%${universityQuery}%`, limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const randomUniversities = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectRandomUniversities, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

module.exports = {
    getAllUniversities,
    getUniversity,
    searchUniversity,
    randomUniversities
};