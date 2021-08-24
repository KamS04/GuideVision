module.exports = {
    apps: [{
        name: "GuidingVision",
        script: "./app.js",
        env: {
            "PORT": 8080,
            "DB_FILE": "~/Documents/GuideVision/api/guidingvision.db",
            "DEBUG": true
        }
    }]
}
