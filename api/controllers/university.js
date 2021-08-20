const database = require('../data/processors/university');
const { NOT_FOUND } = require('../data/utils');
const { createController, IntegerArg, StringArg, QUERY } = require('../controllers/preprocessor/paramprocessor');
const { resWriteSuccess, resWriteFail } = require('./response');

const getUniversity = createController( { name: 'id', type: IntegerArg }, async (req, res) => {
    let { id } = req.parsedParams;
    try {
        const university = await database.getUniversity(id);
        resWriteSuccess(res, university);
    } catch (err) {
        if (err == NOT_FOUND) {
            resWriteFail(res, `No University with id ${id}`, 404);
        } else {
            resWriteFail(res, 'Internal server error', 500);
            console.error(err);
        }
    }
});

const getUniversities = createController([
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const universities = await database.getAllUniversities(limit, offset);
        resWriteSuccess(res, universities);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const searchUniversities = createController([
    { name: 'name', type: StringArg, group: QUERY },
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { name, limit, offset } = req.parsedQuery;
        const universities = await database.searchUniversities(name, limit, offset);
        resWriteSuccess(res, universities);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getRandomUniversities = createController([
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const universities = await database.getRandomUniversities(limit, offset);
        resWriteSuccess(res, universities);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

module.exports = {
    getUniversity,
    getUniversities,
    searchUniversities,
    getRandomUniversities,
};
