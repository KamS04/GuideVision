const express = require('express');
const router = express.Router();

const {
    getCourse,
    getCourses,
    getMiniCourse,
    getCategoryCourses
} = require('../controllers/course');

router.route('/').get(getCourses);
router.route('/:id').get(getCourse);
router.route('/minified').get(getMiniCourse);
router.route('/minified/:categoryId').get(getCategoryCourses);

module.exports = router;
