const express = require('express');
const router = express.Router();

const {
    getCourse,
    getCourses,
    getMiniCourses,
    getMiniCoursesByIds,
    getCategoryCourses,
    searchMiniCourses,
    getRandomCourses,
    getRandomMinifiedCourses
} = require('../controllers/course');

router.route('/').get(getCourses);
router.route('/search').get(searchMiniCourses);
router.route('/random').get(getRandomCourses);
router.route('/minified').get(getMiniCourses);
router.route('/minified/specific').get(getMiniCoursesByIds);
router.route('/minified/random').get(getRandomMinifiedCourses);
router.route('/minified/:categoryId').get(getCategoryCourses);
router.route('/:id').get(getCourse);

module.exports = router;
