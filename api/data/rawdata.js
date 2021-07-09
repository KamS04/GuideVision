const sqlite = require('sqlite3').verbose();
const config = require('../config');
const sqlNames = require('./sqlnames');
const queries = require('./queries');
const { json } = require('express');

const db = new sqlite.Database(config.DB_FILE, () => {
    console.log(`Connected to ${config.DB_FILE}...`)
})

// Initial Table Creations
db.exec(queries.universityTableQuery, (err) => {
    if (err) {
        console.error('Universities table');
        throw err;
    }

    console.log('Universities table created/exists...');
});

db.exec(queries.courseTableQuery, (err) => {
    if (err) {
        console.error('Courses table');
        throw err;
    }

    console.log('Courses table created/exists...');
});

db.exec(queries.categoryTableQuery, (err) => {
    if (err) {
        console.error('Categories table');
        throw err;
    }

    console.log('Categories table created/exists...');
});

db.exec(queries.categoryCourseJunctionTableQuery, (err) => {
    if (err) {
        console.error('Category-Course-Junction table');
        throw err;
    }

    console.log('Category-Course-Junction table created/exists...');
});

const getAllUniversities = (limit, offset) => {
    return new Promise((resolve, reject) => {
        db.all(queries.selectAllUniversities, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
            return;
        });
    });
};

const getUniversity = (id) => {
    return new Promise((resolve, reject) => {
        db.get(queries.selectUniversityById, id, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

const getAllCategories = (limit, offset) => {
    return new Promise((resolve, reject) => {
        db.all(queries.selectMinifiedCategories, [limit, offset], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
};

const getCategoryDetails = (id) => {
    return new Promise((resolve, reject) => {
        db.get(queries.selectCategoryById, id, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

const getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(queries.selectCourseById, id, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

const getAllCourses = (limit, offset) => {
    return new Promise((resolve, reject) => {
        db.get(queries.selectAllCourses, [limit, offset], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

const getMinifiedCourseDetails = (...ids) => {
    return new Promise((resolve, reject) => {
        idsSelector = ids.map((val) => '?').join(', ')
        db.all(queries.selectMinifiedCourseDetails(idsSelector), ids, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

module.exports = {
    getUniversity,
    getAllUniversities,
    getAllCategories,
    getCategoryDetails,
    getCourseById,
    getAllCourses,
    getMinifiedCourseDetails
}