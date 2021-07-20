const database = require('../data/processing');
const { resWriteSuccess, resWriteFail } = require('./response.js');

const getUniversity = async (req, res) => {
    const { id } = req.params;

    if (id == null || typeof(id) !== Number) {
        resWriteFail(res, 'Missing url parameter id of type integer');
        return;
    }

    try {
        const university = await database.getUniversity(id);
        resWriteSuccess(res, university);
    } catch (err) {
        if (err == database.NOT_FOUND) {
            resWriteFail(res, `No University with id ${id}`, 404);
        } else {
            resWriteFail(res, `Internal server error`, 500);
            console.error(err);
        }
    }
};

const getUniversities = async (req, res) => {
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
        const universities = await database.getAllUniversities(limit, offset);
        resWriteSuccess(res, universities);
    } catch (err) {
        res.resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};

const searchUniversities = async (req, res) => {
    const { name, limit, offset } = req.query;

    if (name == limit || limit == null || offset == null) {
        resWriteFail(res, 'Missing query parameters name, limit, and offset');
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return;
    }

    if (typeof(name) !== String) {
        resWriteFail(res, 'Query parameter name must be of type string');
        return;        
    }

    try {
        const universities = await database.searchUniversities(name, limit, offset);
        resWriteSuccess(res, universities);
    } catch (err) {
        res.resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
};


module.exports = {
    getUniversity,
    getUniversities,
    searchUniversities
}