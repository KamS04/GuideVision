const express = require('express');
const router = express.Router();

const {
    getUniversity,
    getUniversities,
    searchUniversities,
    getRandomUniversities
} = require('../controllers/university');

router.route('/').get(getUniversities);
router.route('/search').get(searchUniversities);
router.route('/random').get(getRandomUniversities);
router.route('/:id').get(getUniversity);

module.exports = router;
