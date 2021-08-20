const express = require('express');
const router = express.Router();

const {
    getProgram,
    getPrograms,
    getRandomPrograms,
    getMiniPrograms,
    getSpecificMiniPrograms,
    getMinifiedProgramsByPathway,
    getMinifiedProgramsByUniversity,
    searchMinifiedPrograms,
    getRandomMinifiedPrograms,
} = require('../controllers/program');

router.route('/').get(getPrograms);
router.route('/search').get(searchMinifiedPrograms);
router.route('/random').get(getRandomPrograms);
router.route('/minified').get(getMiniPrograms);
router.route('/minified/specific').get(getSpecificMiniPrograms);
router.route('/minified/random').get(getRandomMinifiedPrograms);
router.route('/minified/university/:universityId').get(getMinifiedProgramsByUniversity);
router.route('/minified/pathway/:pathwayId').get(getMinifiedProgramsByPathway);
router.route('/:id').get(getProgram);

module.exports = router;
