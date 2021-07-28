const express = require('express');
const router = express.Router();

const {
    getCategory,
    getCategories,
    searchCategories,
    getRandomCategories
} = require('../controllers/categories');

router.route('/').get(getCategories);
router.route('/search').get(searchCategories);
router.route('/random').get(getRandomCategories);
router.route('/:id').get(getCategory);

module.exports = router;
