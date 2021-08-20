const db = require('./database');
const queries = require('../queries/program');

const getAllPrograms = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectAllPrograms, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getProgramById = (id) => {
    return new Promise( (resolve, reject) => {
        db.get(queries.selectProgramById, id, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getRandomPrograms = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectRandomPrograms, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getAllMinifiedPrograms = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectAllMinifiedPrograms, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getSpecificMinifiedPrograms = (...ids) => {
    return new Promise( (resolve, reject) => {
        idsSelector = ids.map((val) => '?').join(', ');
        db.all(queries.selectSpecificMinifiedPrograms(idsSelector), ids, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getMinifiedProgramsByPathway = (pathwayId) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectMinifiedProgramsByPathway, pathwayId, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getMinifiedProgramsByUniversity = (universityId) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectMinifiedProgramByUniversity, universityId, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const searchMinifiedPrograms = (programQuery, limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.searchMinifiedPrograms(programQuery), [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const randomMinifiedPrograms = (limit, offset) => {
    return new Promise( (resolve, reject) => {
        db.all(queries.selectRandomMinifiedPrograms, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

module.exports = {
    getAllPrograms,
    getProgramById,
    getRandomPrograms,
    getAllMinifiedPrograms,
    getSpecificMinifiedPrograms,
    getMinifiedProgramsByPathway,
    getMinifiedProgramsByUniversity,
    searchMinifiedPrograms,
    randomMinifiedPrograms
};
