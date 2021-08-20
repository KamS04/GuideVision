const database = require('../data/processors/pathway');
const { NOT_FOUND } = require('../data/utils');
const { createController, IntegerArg, StringArg, QUERY } = require('./preprocessor/paramprocessor');
const { resWriteSuccess, resWriteFail } = require('./response');

const getPathway = createController( { name: 'id', type: IntegerArg }, async (req, res) => {
    let { id } = req.parsedParams;
    try {
        const pathway = await database.getPathwayById(id);
        resWriteSuccess(res, pathway);
    } catch (err) {
        if (err == NOT_FOUND) {
            resWriteFail(res, `No pathway with id ${id}`);
        } else {
            resWriteFail(res, 'Internal server error', 500);
            console.error(err);
        }
    }
});

const getPathways = createController( [
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY }
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const pathways = await database.getAllPathways(limit, offset);
        resWriteSuccess(res, pathways);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.log(error);
    }
});

const searchPathways = createController([
    { name: 'title', type: StringArg, group: QUERY },
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY }
], async (req, res) => {
    try {
        let { title, limit, offset } = req.parsedQuery;
        const pathways = await database.searchPathways(title, limit, offset);
        resWriteSuccess(res, pathways);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getRandomPathways = createController([
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const pathways = await database.getRandomPathways(limit, offset);
        resWriteSuccess(res, pathways);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

module.exports = {
    getPathway,
    getPathways,
    searchPathways,
    getRandomPathways
};
