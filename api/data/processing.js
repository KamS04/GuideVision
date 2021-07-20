const sqlNames = require('./sqlnames');
const rawData = require('./rawdata');
const University = require('../models/University');
const Category = require('../models/Category');
const { Prerequisite, Course, MiniCourse } = require('../models/Course');

NOT_FOUND = 'Not Found';

// Universities
const mapUniversity = (rawUniversity) => {
    return new University(
        rawUniversity[sqlNames.UNI_ID],
        rawUniversity[sqlNames.UNI_NAME],
        JSON.parse(rawUniversity[sqlNames.UNI_FACULTIES]),
        rawUniversity[sqlNames.UNI_PHONE],
        rawUniversity[sqlNames.UNI_STREET_ADDRESS],
        rawUniversity[sqlNames.UNI_CITY],
        rawUniversity[sqlNames.UNI_PROVINCE],
        rawUniversity[sqlNames.UNI_COUNTRY],
        rawUniversity[sqlNames.UNI_POSTAL],
        rawUniversity[sqlNames.UNI_URL],
        rawUniversity[sqlNames.UNI_ICON_URL],
    );
};

const getUniversity = async (id) => {
    const rawUniversity = await rawData.getUniversity(id);
    if (rawUniversity == null) {
        throw NOT_FOUND;
    }
    return mapUniversity(rawUniversity);
};

const getAllUniversities = async (limit, offset) => {
    const rawUniversities = await rawData.getAllUniversities(limit, offset);
    return rawUniversities.map(mapUniversity);
};

const searchUniversities = async (uniQuery, limit, offset) => {
    const rawUniversities = await rawData.searchUniversity(uniQuery, limit, offset);
    return rawUniversities.map(mapUniversity);
}

// Categories
const mapCategory = (rawCategory) => {
    return new Category(
        rawCategory[sqlNames.CATEGORY_ID],
        rawCategory[sqlNames.CATEGORY_TITLE],
        JSON.parse(rawCategory[sqlNames.CATEGORY_FUTURE_JOB_OPPS])
    );
};

const getCategoryDetails = async (id) => {
    const rawCategory = await rawData.getCategoryDetails(id);
    if (rawCategory == null) {
        throw NOT_FOUND;
    }    
    return mapCategory(rawCategory);
}

const getAllCategories = async (limit, offset) => {
    const rawCategories = await rawData.getAllCategories(limit, offset);    
    return rawCategories.map(mapCategory);
};

const searchCategories = async (categoryQuery, limit, offset) => {
    const rawCategories = await rawData.searchCategory(categoryQuery, limit, offset);
    return rawCategories.map(mapCategory);
}

// Courses
const mapPrerequisites = (prerequisitesString) => {  
    return JSON.parse(prerequisitesString).map((rawPrerequisite) => {
        return new Prerequisite(
            rawPrerequisite.title,
            rawPrerequisite.reqs
        );
    });
};

const mapCourse = (rawCourse) => {
    return new Course(
        rawCourse[sqlNames.COURSE_ID],
        rawCourse[sqlNames.COURSE_UNI],
        rawCourse[sqlNames.COURSE_TITLE],
        JSON.parse(rawCourse[sqlNames.COURSE_FACULTY]),
        mapPrerequisites(rawCourse[sqlNames.COURSE_PREQ]),
        rawCourse[sqlNames.COURSE_AVE],
        rawCourse[sqlNames.COURSE_DOM_TUI],
        rawCourse[sqlNames.COURSE_DOM_BOOKS],
        rawCourse[sqlNames.COURSE_DOM_NOTES],
        rawCourse[sqlNames.COURSE_INT_TUI],
        rawCourse[sqlNames.COURSE_INT_BOOKS],
        rawCourse[sqlNames.COURSE_INT_NOTES],
        JSON.parse(rawCourse[sqlNames.COURSE_NOTES]),
    );
};

const getCourseById = async (id) => {
    const rawCourse = await rawData.getCourseById(id);
    if (rawCourse == null) {
        throw NOT_FOUND;
    }
    return mapCourse(rawCourse);
};

const getAllCourses = async (limit, offset) => {
    const rawCourses = await rawData.getAllCourses(limit, offset);
    return rawCourses.map(mapCourse);
};

const mapMinifiedCourses = (rawMinifiedCourse) => {
    return new MiniCourse(
        rawMinifiedCourse[sqlNames.COURSE_ID],
        rawMinifiedCourse[sqlNames.COURSE_TITLE],
        rawMinifiedCourse[sqlNames.UNI_NAME],
        rawMinifiedCourse[sqlNames.UNI_ICON_URL]
    );
};

const getMinifiedCourseDetails = async (...ids) => {
    const rawCourses = await rawData.getMinifiedCourseDetails(...ids);
    return rawCourses.map(mapMinifiedCourses);
};

const getMinifiedCoursesByCategory = async (categoryId) => {
    const rawCourses = await rawData.getMinifiedCoursesByCategory(categoryId);
    return rawCourses.map(mapMinifiedCourses);
};

const searchCourses = async (courseQuery, limit, offset) => {
    const rawCourses = await rawData.searchCourse(courseQuery, limit, offset);
    return rawCourses.map(mapCourse);
};

const searchMinifiedCourses = async (courseQuery, limit, offset) => {
    const rawCourses = await rawData.searchMinifiedCourse(courseQuery, limit, offset);
    return rawCourses.map(mapMinifiedCourses);
};


module.exports = {
    NOT_FOUND,
    
    getUniversity,
    getAllUniversities,
    getCategoryDetails,
    getAllCategories,
    getCourseById,
    getAllCourses,
    getMinifiedCourseDetails,
    getMinifiedCoursesByCategory,

    searchUniversities,
    searchCategories,
    searchCourses,
    searchMinifiedCourses
}