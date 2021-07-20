const database = require('../data/processing');
const { resWriteSuccess, resWriteFail } = require('./response.js');

const getCourse = async (req, res) => {
    const { id } = req.params;

    if (id == null || typeof(id) !== Number) {
        resWriteFail(res, 'Missing url parameter id of type integer');
        return;
    };
    
    try {
        const course = await database.getCourseById(id);
        resWriteSuccess(res, course);
    } catch (err) {
        if (err == database.NOT_FOUND) {
            resWriteFail(res, `No Course with id ${id}`, 404);
        } else {
            resWriteFail(res, 'Internal server error', 500);
            console.error(err);
        }
    }
};

const getCourses = async (req, res) => {
    const { limit, offset } = req.query;

    if (limit == null || offset == null) {
        resWriteFail(res, 'Missing query parameters limit and offset');
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    try {
        const courses = await database.getAllCourses(limit, offset);
        resWriteSuccess(res, courses);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const getMiniCourse = async (req, res) => {
    const { ids } = req.query;
    if (ids == null || typeof(ids) !== Array || ids.every((id) => typeof(id) === Number)) {
        resWriteFail(res, 'Missing query parameter id of type array');
        return;
    }

    try {
        const miniCourses = await database.getMinifiedCourseDetails(...ids);
        resWriteSuccess(res, miniCourses);        
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const getCategoryCourses = async (req, res) => {
    const { categoryId } = req.params;

    if (categoryId == null || typeof(categoryId) !== Number) {
        resWriteFail(res, 'Missing url parameter category of type integer');
        return;
    }

    try {
        const miniCourses = await database.getMinifiedCoursesByCategory(categoryId);
        resWriteSuccess(res, miniCourses);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const searchCourses = async (req, res) => {
    const { title, limit, offset } = req.query;

    if (title == null || limit == null || offset == null) {
        resWriteFail(res, 'Missing query parameters title, limit, and offset');
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    if (typeof(title) !== String) {
        resWriteFail(res, 'Query parameter title must be of type string');
        return;        
    }

    try {
        const courses = await database.searchCourses(title, limit, offset);
        resWriteSuccess(res, courses);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const searchMiniCourses = async (req, res) => {
    const { title, limit, offset } = req.query;

    if (title == null || limit == null || offset == null) {
        resWriteFail(res, 'Missing query parameters title, limit, and offset');
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    if (typeof(title) !== String) {
        resWriteFail(res, 'Query parameter title must be of type string');
        return;        
    }
    try {
        const miniCourses = await database.searchMinifiedCourses(title, limit, offset);
        resWriteSuccess(res, miniCourses);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

module.exports = {
    getCourse,
    getCourses,
    getMiniCourse,
    getCategoryCourses,

    searchCourses,
    searchMiniCourses
}