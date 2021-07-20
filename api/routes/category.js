const express = require('express');
const router = express.Router();

const {
    getCategory,
    getCategories,
    searchCategories
} = require('../controllers/categories');

router.route('/').get(getCategories);
router.route('/:id').get(getCategory);
router.route('/search').get(searchCategories);

module.exports = router;
