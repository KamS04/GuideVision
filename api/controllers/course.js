const database = require('../data/processing');
const { resWriteSuccess, resWriteFail } = require('./response.js');

const getCourse = async (req, res) => {
    const { id } = req.params;

    const pId = parseInt(id);

    if (id == null || isNaN(pId) ) {
        resWriteFail(res, 'Missing url parameter id of type integer');
        return;
    };
    
    try {
        const course = await database.getCourseById(pId);
        resWriteSuccess(res, course);
    } catch (err) {
        if (err == database.NOT_FOUND) {
            resWriteFail(res, `No Course with id ${pId}`, 404);
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

    const [ pLimit, pOffset ] = [ parseInt(limit), parseInt(offset) ];

    if ( isNaN(pLimit) || isNaN(pOffset) ) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    try {
        console.log('passedChecks');

        const courses = await database.getAllCourses(pLimit, pOffset);
        resWriteSuccess(res, courses);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const getMiniCourse = async (req, res) => {
    const { ids } = req.query;        

    if (ids === null || !Array.isArray(ids) ) {
        resWriteFail(res, 'Missing query parameter ids of type array');
        return;
    }

    const mappedIds = ids.map( (id) => parseInt(id) );

    if ( mappedIds.some( (id) => isNaN(id) ) ) {
        resWriteFail(res, 'All ids in query parameter ids must be of type Number');
        return
    }

    try {
        const miniCourses = await database.getMinifiedCourseDetails(...mappedIds);
        resWriteSuccess(res, miniCourses);        
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const getCategoryCourses = async (req, res) => {
    const { categoryId } = req.params;

    const pCategoryId = parseInt(categoryId);

    if (categoryId == null || isNaN(pCategoryId)) {
        resWriteFail(res, 'Missing url parameter category of type integer');
        return;
    }

    try {
        const miniCourses = await database.getMinifiedCoursesByCategory(pCategoryId);
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

    const [ pLimit, pOffset ] = [ parseInt(limit), parseInt(offset) ];

    if ( isNaN(pLimit) || isNaN(pOffset) ) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    if (typeof(title) !== String) {
        resWriteFail(res, 'Query parameter title must be of type string');
        return;        
    }

    try {
        const courses = await database.searchCourses(title, pLimit, pOffset);
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

    const [ pLimit, pOffset ] = [ parseInt(limit), parseInt(offset) ];

    if ( isNaN(pLimit) || isNaN(pOffset) ) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    if (typeof(title) !== String) {
        resWriteFail(res, 'Query parameter title must be of type string');
        return;        
    }
    try {
        const miniCourses = await database.searchMinifiedCourses(title, pLimit, pOffset);
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