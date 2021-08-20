const db = require('./database');
const queries = require('../queries/pathway');

const getAllPathways = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectAllPathways, [limit, offset], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getPathwayById = (pathwayId) => {
    return new Promise( (resolve, reject) => {
        db.get(queries.selectPathwayById, pathwayId, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const searchPathway = (pathwayId, limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.searchPathway(pathwayId), [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getRandomPathways = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectRandomPathways, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

module.exports = {
    getAllPathways,
    getPathwayById,
    searchPathway,
    getRandomPathways
};
