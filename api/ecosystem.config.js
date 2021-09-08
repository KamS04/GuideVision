module.exports = {
    apps: [{
        name: "GuidingVision",
        script: "./app.js",
        env: {
            "PORT": 8080,
            "DB_FILE": "/home/gv/GuidingVision/api/guidingvision.db",
            "DEBUG": true
        }
    }]
}
