const database = require('../data/processors/program');
const { NOT_FOUND } = require('../data/utils');
const { createController, IntegerArg, StringArg, QUERY, IntArrayArg } = require('./preprocessor/paramprocessor');
const { resWriteSuccess, resWriteFail } = require('./response');

const getProgram = createController( { name: 'id', type: IntegerArg }, async (req, res) => {
    let { id } = req.parsedParams;
    try {
        const program = await database.getProgramById(id);
        resWriteSuccess(res, program);
    } catch (err) {
        if (err == NOT_FOUND) {
            resWriteFail(res, `No Program with id ${id}`, 404);
        } else {
            resWriteFail(res, 'Internal server error', 500);
            console.error(err);
        }
    }
});

const getPrograms = createController([
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const programs = await database.getAllPrograms(limit, offset);
        resWriteSuccess(res, programs);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getRandomPrograms = createController([
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY }
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const programs = await database.getRandomPrograms(limit, offset);
        resWriteSuccess(res, programs);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getMiniPrograms = createController([
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const miniPrograms = await database.getMinifiedPrograms(limit, offset);
        resWriteSuccess(res, miniPrograms);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getSpecificMiniPrograms = createController([
    { name: 'ids', type: IntArrayArg, group: QUERY }
], async (req, res) => {
    try {
        let { ids } = req.parsedQuery;
        const miniPrograms = await database.getSpecificMinifiedPrograms(...ids);
        resWriteSuccess(res, miniPrograms);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getMinifiedProgramsByPathway = createController( { name: 'pathwayId', type: IntegerArg }, async (req, res) => {
    let { pathwayId } = req.parsedParams;
    try {
        const miniPrograms = await database.getMinifiedProgramsByPathway(pathwayId);
        resWriteSuccess(res, miniPrograms);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getMinifiedProgramsByUniversity = createController( { name: 'universityId', type: IntegerArg }, async (req, res) => {
    let { universityId } = req.parsedParams;
    try {
        const miniPrograms = await database.getMinifiedProgramsByUniversity(universityId);
        resWriteSuccess(res, miniPrograms);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const searchMinifiedPrograms = createController([
    { name: 'title', type: StringArg, group: QUERY },
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { title, limit, offset } = req.parsedQuery;
        const miniPrograms = await database.searchMinifiedProgram(title, limit, offset);
        resWriteSuccess(res, miniPrograms);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

const getRandomMinifiedPrograms = createController([
    { name: 'limit', type: IntegerArg, group: QUERY },
    { name: 'offset', type: IntegerArg, group: QUERY },
], async (req, res) => {
    try {
        let { limit, offset } = req.parsedQuery;
        const miniPrograms = await database.getRandomMinifiedPrograms(limit, offset);
        resWriteSuccess(res, miniPrograms);
    } catch (err) {
        resWriteFail(res, 'Internal server error', 500);
        console.error(err);
    }
});

module.exports = {
    getProgram,
    getPrograms,
    getRandomPrograms,
    getMiniPrograms,
    getSpecificMiniPrograms,
    getMinifiedProgramsByPathway,
    getMinifiedProgramsByUniversity,
    searchMinifiedPrograms,
    getRandomMinifiedPrograms,
};
