const sqlNames = require('../sqlnames/pathway');
const rawData = require('../rawdata/pathway');

const Pathway = require('../models/Pathway');
const { NOT_FOUND } = require('../utils');

const mapPathway = (rawPathway) => {
    return new Pathway(
        rawPathway[sqlNames.PATHWAY_ID],
        rawPathway[sqlNames.PATHWAY_TITLE],
        JSON.parse(rawPathway[sqlNames.PATHWAY_FUTURE_JOB_OPPS])
    );
};

const getPathwayById = async (id) => {
    const rawPathway = await rawData.getPathwayById(id);
    if (rawPathway == undefined) {
        throw NOT_FOUND;
    }
    return mapPathway(rawPathway);
};

const getAllPathways = async (limit, offset) => {
    const rawPathways = await rawData.getAllPathways(limit, offset);
    return rawPathways.map(mapPathway);
};

const searchPathways = async (pathwayQuery, limit, offset) => {
    const rawPathways = await rawData.searchPathway(pathwayQuery, limit, offset);
    return rawPathways.map(mapPathway);
};

const getRandomPathways = async (limit, offset) => {
    const rawPathways = await rawData.getRandomPathways(limit, offset);
    return rawPathways.map(mapPathway);
};

module.exports = {
    getPathwayById,
    getAllPathways,
    searchPathways,
    getRandomPathways
};
