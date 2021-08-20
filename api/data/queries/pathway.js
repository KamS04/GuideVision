const sqlNames = require('../sqlnames/pathway');

const pathwayTableQuery = `CREATE TABLE IF NOT EXISTS ${sqlNames.PATHWAYS} (
    ${sqlNames.PATHWAY_ID} INTEGER PRIMARY KEY,
    ${sqlNames.PATHWAY_TITLE} TEXT,
    ${sqlNames.PATHWAY_FUTURE_JOB_OPPS} BLOB
);`;

const selectAllPathways = `SELECT * FROM ${sqlNames.PATHWAYS} LIMIT ? OFFSET ?;`;

const selectPathwayById = `SELECT * FROM ${sqlNames.PATHWAYS} WHERE ${sqlNames.PATHWAY_ID} = ?;`;

const selectRandomPathways = `SELECT * FROM ${sqlNames.PATHWAYS} ORDER BY RANDOM() LIMIT ? OFFSET ?;`;

const searchPathway = (pathwayQuery) => {
    return `SELECT *
        FROM
            ${sqlNames.PATHWAYS}
        WHERE
            ${sqlNames.PATHWAY_TITLE} LIKE "%${pathwayQuery}%"
        LIMIT ? OFFSET ?;`;
};

module.exports = {
    pathwayTableQuery,
    selectAllPathways,
    selectPathwayById,
    selectRandomPathways,
    searchPathway
};
