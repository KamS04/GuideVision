const sqlNames = require('../sqlnames/university');
const rawData = require('../rawdata/university');

const University = require('../models/University');
const { NOT_FOUND } = require('../utils');

const mapUniversity = (rawUniversity) => {
    return new University(
        rawUniversity[sqlNames.UNI_ID],
        rawUniversity[sqlNames.UNI_NAME],
        JSON.parse(rawUniversity[sqlNames.UNI_FACULTIES]),
        rawUniversity[sqlNames.UNI_PHONE],
        rawUniversity[sqlNames.UNI_STREET_ADDRESS],
        rawUniversity[sqlNames.UNI_CITY],
        rawUniversity[sqlNames.UNI_PROVINCE],
        rawUniversity[sqlNames.UNI_COUNTRY],
        rawUniversity[sqlNames.UNI_POSTAL],
        rawUniversity[sqlNames.UNI_URL],
        rawUniversity[sqlNames.UNI_ICON_URL]
    );
};

const getUniversity = async (id) => {
    const rawUniversity = await rawData.getUniversity(id);
    if (rawUniversity == undefined) {
        throw NOT_FOUND;
    }
    return mapUniversity(rawUniversity);
};

const getAllUniversities = async (limit, offset) => {
    const rawUniversities = await rawData.getAllUniversities(limit, offset);
    return rawUniversities.map(mapUniversity);
};

const getRandomUniversities = async (limit, offset) => {
    const rawUniversities = await rawData.randomUniversities(limit, offset);
    return rawUniversities.map(mapUniversity);
};

const searchUniversities = async (uniQuery, limit, offset) => {
    const rawUniversities = await rawData.searchUniversity(uniQuery, limit, offset);
    return rawUniversities.map(mapUniversity);
};

module.exports = {
    getUniversity,
    getAllUniversities,
    getRandomUniversities,
    searchUniversities
};
