const sqlNames = require('./sqlnames');

module.exports = {
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