const express = require('express');
const router = express.Router();

const {
    getCategory,
    getCategories
} = require('../controllers/categories');

router.route('/').get(getCategories);
router.route('/:id').get(getCategory);

module.exports = router;
