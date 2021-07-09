const rawData = require('./rawdata');
const University = require('../models/University');
const Category = require('../models/Category');
const { Prerequisite, Course, MiniCourse } = require('../models/Course');

NOT_FOUND = 'Not Found';

const mapUniversity = (rawUniversity) => {
    return new University(
        rawUniversity.ID,
        rawUniversity.Name,
        JSON.parse(rawUniversity.Faculties),
        rawUniversity.Phone,
        rawUniversity.Street,
        rawUniversity.City,
        rawUniversity.Province,
        rawUniversity.Country,
        rawUniversity.Url,
        rawUniversity.IconUrl
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

const mapCategory = (rawCategory) => {
    return new Category(
        rawCategory.ID,
        rawCategory.CatTitle,
        JSON.parse(rawCategory.Future)
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
        rawCourse.ID,
        rawCourse.CUniversity,
        rawCourse.Title,
        rawCourse.CFaculty,
        mapPrerequisites(rawCourse.Prerequisite),
        rawCourse.RequiredAverage,
        rawCourse.DomesticTuition,
        rawCourse.DomesticBooks,
        rawCourse.DomesticNotes,
        rawCourse.InternationalTuition,
        rawCourse.InternationalBooks,
        rawCourse.InternationalNotes,
        JSON.parse(rawCourse.Notes)
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
        rawMinifiedCourse.ID,
        rawMinifiedCourse.Title,
        rawMinifiedCourse.Name,
        rawMinifiedCourse.IconUrl
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

module.exports = {
    getUniversity,
    getAllUniversities,
    getCategoryDetails,
    getAllCategories,
    getCourseById,
    getAllCourses,
    getMinifiedCourseDetails,
    getMinifiedCoursesByCategory
}