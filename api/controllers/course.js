const database = require('../data/processing');


const getCourse = async (req, res) => {
    const { id } = req.params;

    if (id == null || typeof(id) !== Number) {
        res.status(400).json({
            success: false,
            msg: 'Missing url parameter id of type integer'
        });
        return;
    };
    
    try {
        const course = await database.getCourseById(id);
        res.status(200).json({
            success: true,
            data: course
        })
    } catch (err) {
        if (err == database.NOT_FOUND) {
            res.status(404).json({
                success: false,
                msg: `No Course with id ${id}`
            })
        } else {
            res.status(500).json({
                success: false,
                msg: 'Internal server error'
            })
            console.error(err);
        }
    }
};

const getCourses = async (req, res) => {
    const { limit, offset } = req.query;

    if (limit == null || offset == null) {
        res.status(400).json({
            success: false,
            msg: 'Missing query parameters limit and offset'
        });
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        res.status(400).json({
            success: false,
            msg: 'Query parameters limit and offset must be of type integer'
        });
        return;
    }

    try {
        const courses = await database.getAllCourses(limit, offset);
        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
        console.error(err);
    }
};

const getMiniCourse = async (req, res) => {
    const { ids } = req.query;
    if (ids == null || typeof(ids) !== Array) {
        res.status(400).json({
            success: false,
            msg: 'Missing query parameter id of type array'
        });
        return;
    }

    try {
        const miniCourses = await database.getMinifiedCourseDetails(...ids);
        res.status(200).json({
            success: true,
            data: miniCourses
        })    
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
        console.error(err);
    }
};

const getCategoryCourses = async (req, res) => {
    const { categoryId } = req.params;

    if (categoryId == null || typeof(categoryId) !== Number) {
        res.status(400).json({
            success: false,
            msg: 'Missing url parameter category of type integer'
        });
        return;
    }

    try {
        const miniCourses = await database.getMinifiedCoursesByCategory(categoryId);
        res.status(200).json({
            success: true,
            data: miniCourses
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        })
        console.error(err);
    }
};

module.exports = {
    getCourse,
    getCourses,
    getMiniCourse,
    getCategoryCourses
}