const database = require('../data/processing');
const { resWriteSuccess, resWriteFail } = require('./response');

const getCategory = async (req, res) => {
    const { id } = req.params;

    if (!id || typeof(id) !== Number) {
        resWriteFail(res, 'Missing url paramter id of type integer');
        return;
    }

    try {
        const category = await database.getCategoryDetails(id);
        resWriteSuccess(res, category);
    } catch (err) {
        if (err == database.NOT_FOUND) {
            resWriteFail(res, `No Category with id ${id}`, 404);
        } else {
            resWriteFail(res, 'Internal server error', 500);
            console.error(err);
        }
    }
};

const getCategories = async (req, res) => {
    const { limit, offset } = req.query;

    if (limit == null || offset == null) {
        resWriteFail(res, 'Missing query parameters limit and offset');
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }
    
    try {
        const categories = await database.getAllCategories(limit, offset);
        resWriteSuccess(res, categories);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const searchCategories = async (req, res) => {
    const { title, limit, offset } = req.query;

    if (title == null || limit == null || offset == null) {
        resWriteFail(res, 'Missing query parameters title, limit, and offset');
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    if (typeof(title) !== String) {
        resWriteFail(res, 'Query parameter title must be of type string');
        return;        
    }
    
    try {
        const categories = await database.searchCategories(title, limit, offset);
        resWriteSuccess(res, categories);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

module.exports = {
    getCategory,
    getCategories,
    searchCategories
}