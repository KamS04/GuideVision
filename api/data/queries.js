const sqlNames = require('./sqlnames');

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

const courseTableQuery = `CREATE TABLE IF NOT EXISTS ${sqlNames.COURSES} (
    ${sqlNames.COURSE_ID} INTEGER PRIMARY KEY,
    ${sqlNames.COURSE_UNI} INTEGER,
    ${sqlNames.COURSE_TITLE} TEXT,
    ${sqlNames.COURSE_FACULTY} TEXT,
    ${sqlNames.COURSE_PREQ} BLOB,
    ${sqlNames.COURSE_AVE} INTEGER,
    ${sqlNames.COURSE_DOM_TUI} INTEGER,
    ${sqlNames.COURSE_DOM_BOOKS} INTEGER,
    ${sqlNames.COURSE_DOM_NOTES} TEXT,
    ${sqlNames.COURSE_INT_TUI} INTEGER,
    ${sqlNames.COURSE_INT_BOOKS} INTEGER,
    ${sqlNames.COURSE_INT_NOTES} TEXT,
    ${sqlNames.COURSE_NOTES} BLOB
);`;

const categoryTableQuery = `CREATE TABLE IF NOT EXISTS ${sqlNames.CATEGORIES} (
    ${sqlNames.CATEGORY_ID} INTEGER PRIMARY KEY,
    ${sqlNames.CATEGORY_TITLE} TEXT,
    ${sqlNames.CATEGORY_FUTURE_JOB_OPPS} BLOB
);`;

const categoryCourseJunctionTableQuery = `CREATE TABLE IF NOT EXISTS ${sqlNames.CAT_COU_JUNC} (
    ${sqlNames.CCJ_ID} INTEGER PRIMARY KEY,
    ${sqlNames.CCJ_COURSE} INTEGER,
    ${sqlNames.CCJ_CATEGORY} INTEGER
);`;

module.exports = {
    universityTableQuery,
    courseTableQuery,
    categoryTableQuery,
    categoryCourseJunctionTableQuery,

    selectUniversityById: `SELECT * FROM ${sqlNames.UNIVERSITIES} WHERE ${sqlNames.UNI_ID} = ?;`,
    selectAllUniversities: `SELECT * FROM ${sqlNames.UNIVERSITIES} LIMIT ? OFFSET ?;`,
    selectMinifiedCategories: `SELECT ${sqlNames.CATEGORY_ID, sqlNames.CATEGORY_TITLE} FROM ${sqlNames.CATEGORIES} LIMIT ? OFFSET ?;`,
    selectCategoryById: `SELECT * FROM ${sqlNames.CATEGORIES} WHERE ${sqlNames.CATEGORY_ID} = ?;`,
    selectCourseById: `SELECT * FROM ${sqlNames.COURSES} WHERE ${sqlNames.COURSE_ID} = ?;`,
    selectAllCourses: `SELECT * FROM ${sqlNames.COURSES} LIMIT ? OFFSET ?;`,
    selectMinifiedCourseDetails: (idsSelector) => {
        return `SELECT
            course.${sqlNames.COURSE_TITLE},
            university.${sqlNames.UNI_NAME},
            university.${sqlNames.UNI_ICON_URL} 
        FROM
            ${sqlNames.COURSES} course 
        INNER JOIN ${sqlNames.UNIVERSITIES} university 
        ON
            course.${sqlNames.COURSE_UNI} = university.${sqlNames.UNI_ID}
        WHERE course.${sqlNames.COURSE_ID} in ${idsSelector};`;
    }
}