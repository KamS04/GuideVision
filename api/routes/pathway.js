const express = require('express');
const router = express.Router();

const {
    getPathway,
    getPathways,
    searchPathways,
    getRandomPathways
} = require('../controllers/pathway');

router.route('/').get(getPathways);
router.route('/search').get(searchPathways);
router.route('/random').get(getRandomPathways);
router.route('/:id').get(getPathway);

module.exports = router;
