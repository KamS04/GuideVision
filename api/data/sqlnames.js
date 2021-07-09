// University Table Information
module.exports.UNIVERSITIES = 'Universities';
module.exports.UNI_ID = 'ID';
module.exports.UNI_NAME = 'Name';
module.exports.UNI_FACULTIES = 'Faculties';
module.exports.UNI_PHONE = 'Phone';
module.exports.UNI_STREET_ADDRESS = 'Street';
module.exports.UNI_CITY = 'City';
module.exports.UNI_PROVINCE = 'Province';
module.exports.UNI_COUNTRY = 'Country';
module.exports.UNI_URL = 'Url';
module.exports.UNI_ICON_URL = 'IconUrl';

module.exports.UNIVERSITIES_TABLE = `CREATE TABLE IF NOT EXISTS ${module.exports.UNIVERSITIES} (
    ${module.exports.UNI_ID} INTEGER PRIMARY KEY,
    ${module.exports.UNI_NAME} TEXT,
    ${module.exports.UNI_FACULTIES} BLOB,
    ${module.exports.UNI_PHONE} TEXT,
    ${module.exports.UNI_STREET_ADDRESS} TEXT,
    ${module.exports.UNI_CITY} TEXT,
    ${module.exports.UNI_PROVINCE} TEXT,
    ${module.exports.UNI_COUNTRY} TEXT,
    ${module.exports.UNI_URL} TEXT,
    ${module.exports.UNI_ICON_URL} TEXT
);`;

// Courses Table Information
module.exports.COURSES = 'Courses';
module.exports.COURSE_ID = 'ID';
module.exports.COURSE_UNI = 'CUniversity';
module.exports.COURSE_TITLE = 'Title';
module.exports.COURSE_FACULTY = 'CFaculty';
module.exports.COURSE_PREQ = 'Prequisites';
module.exports.COURSE_AVE = 'RequiredAverage';
module.exports.COURSE_DOM_TUI = 'DomesticTuition';
module.exports.COURSE_DOM_BOOKS = 'DomesticBooks';
module.exports.COURSE_DOM_NOTES = 'DomesticNotes';
module.exports.COURSE_INT_TUI = 'InternationalTuition';
module.exports.COURSE_INT_BOOKS = 'InternationalBooks';
module.exports.COURSE_INT_NOTES = 'InternationalNotes';
module.exports.COURSE_NOTES = 'Notes';

module.exports.COURSES_TABLE = `CREATE TABLE IF NOT EXISTS ${module.exports.COURSES} (
    ${module.exports.COURSE_ID} INTEGER PRIMARY KEY,
    ${module.exports.COURSE_UNI} INTEGER,
    ${module.exports.COURSE_TITLE} TEXT,
    ${module.exports.COURSE_FACULTY} TEXT,
    ${module.exports.COURSE_PREQ} BLOB,
    ${module.exports.COURSE_AVE} INTEGER,
    ${module.exports.COURSE_DOM_TUI} INTEGER,
    ${module.exports.COURSE_DOM_BOOKS} INTEGER,
    ${module.exports.COURSE_DOM_NOTES} TEXT,
    ${module.exports.COURSE_INT_TUI} INTEGER,
    ${module.exports.COURSE_INT_BOOKS} INTEGER,
    ${module.exports.COURSE_INT_NOTES} TEXT,
    ${module.exports.COURSE_NOTES} BLOB
);`;

// Categories Courses
module.exports.CATEGORIES = 'Categories';
module.exports.CATEGORY_ID = 'ID';
module.exports.CATEGORY_TITLE = 'CatTitle';
module.exports.CATEGORY_FUTURE_JOB_OPPS = 'Future';

module.exports.CATEGORIES_TABLE = `CREATE TABLE IF NOT EXISTS ${module.exports.CATEGORIES} (
    ${module.exports.CATEGORY_ID} INTEGER PRIMARY KEY,
    ${module.exports.CATEGORY_TITLE} TEXT,
    ${module.exports.CATEGORY_FUTURE_JOB_OPPS} BLOB
);`;

// Category Course Junction
module.exports.CAT_COU_JUNC = 'CatCourseJunction';
module.exports.CCJ_ID = 'ID';
module.exports.CCJ_COURSE = 'CourseId';
module.exports.CCJ_CATEGORY = 'CategoryId';

module.exports.CATEGORY_COURSE_TABLE = `CREATE TABLE IF NOT EXISTS ${module.exports.CAT_COU_JUNC} (
    ${module.exports.CCJ_ID} INTEGER PRIMARY KEY,
    ${module.exports.CCJ_COURSE} INTEGER,
    ${module.exports.CCJ_CATEGORY} INTEGER
);`;
