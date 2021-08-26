const sqlNames = require('../sqlnames/university');

const universityTableQuery = `CREATE TABLE IF NOT EXISTS ${sqlNames.UNIVERSITIES} (
    ${sqlNames.UNI_ID} INTEGER PRIMARY KEY,
    ${sqlNames.UNI_NAME} TEXT,
    ${sqlNames.UNI_FACULTIES} BLOB,
    ${sqlNames.UNI_PHONE} TEXT,
    ${sqlNames.UNI_STREET_ADDRESS} TEXT,
    ${sqlNames.UNI_CITY} TEXT,
    ${sqlNames.UNI_PROVINCE} TEXT,
    ${sqlNames.UNI_COUNTRY} TEXT,
    ${sqlNames.UNI_POSTAL} TEXT,
    ${sqlNames.UNI_URL} TEXT,
    ${sqlNames.UNI_ICON_URL} TEXT
);`;

const searchUniversity = `SELECT * 
    FROM
        ${sqlNames.UNIVERSITIES} 
    WHERE
        ${sqlNames.UNI_NAME} LIKE ? 
    LIMIT ? OFFSET ?;`;

const selectUniversityById = `SELECT * FROM ${sqlNames.UNIVERSITIES} WHERE ${sqlNames.UNI_ID} = ?;`;

const selectAllUniversities = `SELECT * FROM ${sqlNames.UNIVERSITIES} LIMIT ? OFFSET ?`;

const selectRandomUniversities = `SELECT * FROM ${sqlNames.UNIVERSITIES} ORDER BY RANDOM() LIMIT ? OFFSET ?`;

module.exports = {
    universityTableQuery,
    searchUniversity,
    selectUniversityById,
    selectAllUniversities,
    selectRandomUniversities
};
