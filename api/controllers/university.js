const database = require('../data/processing');

const getUniversity = async (req, res) => {
    const { id } = req.params;

    if (id == null || typeof(id) !== Number) {
        res.status(400).json({
            success: false,
            msg: 'Missing url paramter id of type integer'
        });
        return;
    }

    try {
        const university = await database.getUniversity(id);
        res.status(200).json({
            success: true,
            data: university
        });
    } catch (err) {
        if (err == database.NOT_FOUND) {
            res.status(404).json({
                success: false,
                msg: `No University with id ${id}`
            });
        } else {
            res.status(500).json({
                success: false,
                msg: `Internal server error`
            });
            console.error(err);
        }
    }
};

const getUniversities = async (req, res) => {
    const { limit, offset } = req.query;

    if (limit == null || offset == null) {
        res.status(400).json({
            success: false,
            msg: 'Missing query parameters limit and offset'
        });
        return;
    };

    if (typeof(limit) !== Number || typeof(offset) !== Number) {
        res.status(400).json({
            success: false,
            msg: 'Query parameters limit and offset must be of type integer'
        });
        return;
    }

    try {
        const universities = await database.getAllUniversities(limit, offset);
        res.status(200).json({
            success: true,
            data: universities
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        });
        console.error(err);
    }
};

module.exports = {
    getUniversity,
    getUniversities
}