module.exports = {
    apps: [
        {
            name: "ugrs-app",
            script: "node_modules/.bin/tsx",
            args: "server.ts",
            cwd: "/opt/apps/ugrs-app",
            env: {
                NODE_ENV: "production",
                PORT: 3006
            },
            dotenv: "./.env"
        }
    ]
};