const express = require('express');
const router = express.Router();

const {
    getUniversity,
    getUniversities
} = require('../controllers/university');

router.route('/').get(getUniversities);
router.route('/:id').get(getUniversity);

module.exports = router;
