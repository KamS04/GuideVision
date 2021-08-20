const rawData = require('../rawdata/program');
const sqlNames = require('../sqlnames/program');
const uniNames = require('../sqlnames/university');

const { MiniProgram, Program, Prerequisite } = require('../models/Program');
const { NOT_FOUND } = require('../utils');

const mapPrerequisites = (prerequisiteString) => {
    return JSON.parse(prerequisiteString).map( (rawPrerequisite) => {
        return Prerequisite(
            rawPrerequisite.title,
            rawPrerequisite.prerequisites
        );
    });
};

const mapProgram = (rawProgram) => {
    return new Program(
        rawProgram[sqlNames.PROGRAM_ID],
        rawProgram[sqlNames.PROGRAM_UNI],
        rawProgram[sqlNames.PROGRAM_URL],
        rawProgram[sqlNames.PROGRAM_TITLE],
        rawProgram[sqlNames.PROGRAM_FACULTY],
        mapPrerequisites(rawProgram[sqlNames.PROGRAM_PREQ]),
        rawProgram[sqlNames.PROGRAM_AVE],
        rawProgram[sqlNames.PROGRAM_DOM_TUI],
        rawProgram[sqlNames.PROGRAM_DOM_BOOKS],
        rawProgram[sqlNames.PROGRAM_DOM_NOTES],
        rawProgram[sqlNames.PROGRAM_INT_TUI],
        rawProgram[sqlNames.PROGRAM_INT_BOOKS],
        rawProgram[sqlNames.PROGRAM_INT_NOTES],
        rawProgram[sqlNames.PROGRAM_NOTES]
    );
};

const mapMinifiedPrograms = (rawMinifiedProgram) => {
    return new MiniProgram(
        rawMinifiedProgram[sqlNames.PROGRAM_ID],
        rawMinifiedProgram[sqlNames.PROGRAM_TITLE],
        rawMinifiedProgram[uniNames.UNI_NAME],
        rawMinifiedProgram[uniNames.UNI_ICON_URL]
    );
};

const getProgramById = async (id) => {
    const rawProgram = await rawData.getProgramById(id);
    if (rawProgram == undefined) {
        throw NOT_FOUND;
    }
    return mapProgram(rawProgram);
};

const getAllPrograms = async (limit, offset) => {
    const rawPrograms = await rawData.getAllPrograms(limit, offset);
    return rawPrograms.map(mapProgram);
};

const getRandomPrograms = async (limit, offset) => {
    const rawPrograms = await rawData.getRandomPrograms(limit, offset);
    return rawPrograms.map(mapProgram);
};

const getMinifiedPrograms = async (limit, offset) => {
    const rawPrograms = await rawData.getAllMinifiedPrograms(limit, offset);
    return rawPrograms.map(mapMinifiedPrograms);
};

const getSpecificMinifiedPrograms = async (...ids) => {
    const rawPrograms = await rawData.getSpecificMinifiedPrograms(...ids);
    return rawPrograms.map(mapMinifiedPrograms);
};

const getMinifiedProgramsByPathway = async (pathwayId) => {
    const rawPrograms = await rawData.getMinifiedProgramsByPathway(pathwayId);
    return rawPrograms.map(mapMinifiedPrograms);
};

const getMinifiedProgramsByUniversity = async (universityId) => {
    const rawPrograms = await rawData.getMinifiedProgramsByUniversity(universityId);
    return rawPrograms.map(mapMinifiedPrograms);
};

const searchMinifiedProgram = async (programQuery, limit, offset) => {
    const rawPrograms = await rawData.searchMinifiedPrograms(programQuery, limit, offset);
    return rawPrograms.map(mapMinifiedPrograms);
};

const getRandomMinifiedPrograms = async (limit, offset) => {
    const rawPrograms = await rawData.randomMinifiedPrograms(limit, offset);
    return rawPrograms.map(mapMinifiedPrograms);
};

module.exports = {
    getProgramById,
    getAllPrograms,
    getRandomPrograms,
    getMinifiedPrograms,
    getSpecificMinifiedPrograms,
    getMinifiedProgramsByPathway,
    getMinifiedProgramsByUniversity,
    searchMinifiedProgram,
    getRandomMinifiedPrograms
};
