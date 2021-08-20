const sqlNames = require('../sqlnames/program');
const uniNames = require('../sqlnames/university');

const programTableQuery = `CREATE TABLE IF NOT EXISTS ${sqlNames.PROGRAMS} (
    ${sqlNames.PROGRAM_ID} INTEGER PRIMARY KEY,
    ${sqlNames.PROGRAM_UNI} INTEGER,
    ${sqlNames.PROGRAM_URL} TEXT,
    ${sqlNames.PROGRAM_TITLE} TEXT,
    ${sqlNames.PROGRAM_FACULTY} TEXT,
    ${sqlNames.PROGRAM_PREQ} BLOB,
    ${sqlNames.PROGRAM_AVE} INTEGER,
    ${sqlNames.PROGRAM_DOM_TUI} INTEGER,
    ${sqlNames.PROGRAM_DOM_BOOKS} INTEGER,
    ${sqlNames.PROGRAM_DOM_NOTES} TEXT,
    ${sqlNames.PROGRAM_INT_TUI} INTEGER,
    ${sqlNames.PROGRAM_INT_BOOKS} INTEGER,
    ${sqlNames.PROGRAM_INT_NOTES} TEXT,
    ${sqlNames.PROGRAM_NOTES} TEXT
);`;

const categoryCourseJunctionTableQuery = `CREATE TABLE IF NOT EXISTS ${sqlNames.CAT_COU_JUNC} (
    ${sqlNames.CCJ_ID} INTEGER PRIMARY KEY,
    ${sqlNames.CCJ_COURSE} INTEGER,
    ${sqlNames.CCJ_CATEGORY} INTEGER
);`;

const selectAllPrograms = `SELECT * FROM ${sqlNames.PROGRAMS} LIMIT ? OFFSET ?;`;

const selectProgramById = `SELECT * FROM ${sqlNames.PROGRAMS} WHERE ${sqlNames.PROGRAM_ID} = ?;`;

const selectRandomPrograms = `SELECT * FROM ${sqlNames.PROGRAMS} ORDER BY RANDOM() LIMIT ? OFFSET ?`;

const selectRandomMinifiedPrograms = `SELECT
    program.${sqlNames.PROGRAM_ID},
    program.${sqlNames.PROGRAM_TITLE},
    university.${uniNames.UNI_NAME},
    university.${uniNames.UNI_ICON_URL}
FROM
    ${sqlNames.PROGRAMS} program
INNER JOIN ${uniNames.UNIVERSITIES} university
ON
    program.${sqlNames.PROGRAM_UNI} = university.${uniNames.UNI_ID}
ORDER BY RANDOM() LIMIT ? OFFSET ?`;

const selectAllMinifiedPrograms = `SELECT
    program.${sqlNames.PROGRAM_ID},
    program.${sqlNames.PROGRAM_TITLE},
    university.${uniNames.UNI_NAME},
    university.${uniNames.UNI_ICON_URL}
FROM
    ${sqlNames.PROGRAMS} program
INNER JOIN ${uniNames.UNIVERSITIES} university
ON
    program.${sqlNames.PROGRAM_UNI} = university.${uniNames.UNI_ID}
LIMIT ? OFFSET ?`

const selectSpecificMinifiedPrograms = (idsSelector) => {
    return `SELECT
        program.${sqlNames.PROGRAM_ID},
        program.${sqlNames.PROGRAM_TITLE},
        university.${uniNames.UNI_NAME},
        university.${uniNames.UNI_ICON_URL}
    FROM
        ${sqlNames.PROGRAMS} program
    INNER JOIN ${uniNames.UNIVERSITIES} university
    ON
        program.${sqlNames.PROGRAM_UNI} = university.${uniNames.UNI_ID}
    WHERE program.${sqlNames.PROGRAM_ID} in (${idsSelector});`;
};

const selectMinifiedProgramsByPathway = `SELECT
    program.${sqlNames.PROGRAM_ID},
    program.${sqlNames.PROGRAM_TITLE},
    university.${uniNames.UNI_NAME},
    university.${uniNames.UNI_ICON_URL}
FROM
    ${sqlNames.CAT_COU_JUNC} ccj
INNER JOIN ${sqlNames.PROGRAMS} program
ON
    ccj.${sqlNames.CCJ_COURSE} = program.${sqlNames.PROGRAM_ID}
INNER JOIN ${uniNames.UNIVERSITIES} university
ON
    program.${sqlNames.PROGRAM_UNI} = university.${uniNames.UNI_ID}
WHERE
    ccj.${sqlNames.CCJ_CATEGORY} = ?;`;

const selectMinifiedProgramByUniversity = `SELECT
    program.${sqlNames.PROGRAM_ID},
    program.${sqlNames.PROGRAM_TITLE},
    university.${uniNames.UNI_NAME},
    university.${uniNames.UNI_ICON_URL}
FROM
    ${sqlNames.PROGRAMS} program
INNER JOIN ${uniNames.UNIVERSITIES} university
ON
    university.${uniNames.UNI_ID} = program.${sqlNames.PROGRAM_UNI}
WHERE
    university.${uniNames.UNI_ID} = ?;`;

const searchMinifiedPrograms = (programQuery) => {
    return `SELECT
        program.${sqlNames.PROGRAM_ID},
        program.${sqlNames.PROGRAM_TITLE},
        university.${uniNames.UNI_NAME},
        university.${uniNames.UNI_ICON_URL}
    FROM
        ${sqlNames.PROGRAMS} program
    INNER JOIN ${uniNames.UNIVERSITIES} university
    ON
        program.${sqlNames.PROGRAM_UNI} = university.${uniNames.UNI_ID}
    WHERE program.${sqlNames.PROGRAM_TITLE} LIKE "%${programQuery}%"
    LIMIT ? OFFSET ?;`;
};

module.exports = {
    programTableQuery,
    categoryCourseJunctionTableQuery,
    selectAllPrograms,
    selectProgramById,
    selectRandomPrograms,
    selectRandomMinifiedPrograms,
    selectAllMinifiedPrograms,
    selectSpecificMinifiedPrograms,
    selectMinifiedProgramsByPathway,
    selectMinifiedProgramByUniversity,
    searchMinifiedPrograms
};