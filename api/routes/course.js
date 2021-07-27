const express = require('express');
const router = express.Router();

const {
    getCourse,
    getCourses,
    getMiniCourse,
    getCategoryCourses,
    searchMiniCourses
} = require('../controllers/course');

router.route('/').get(getCourses);
router.route('/minified').get(getMiniCourse);
router.route('/minified/:categoryId').get(getCategoryCourses);
router.route('/search').get(searchMiniCourses);
router.route('/:id').get(getCourse);

module.exports = router;
