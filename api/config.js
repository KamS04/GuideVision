module.exports = {
    DEBUG: Boolean(process.env.DEBUG || true),
    PORT: parseInt(process.env.PORT || 9200, 10),
    DB_FILE: process.env.DB_FILE || './guidevision.db'
}