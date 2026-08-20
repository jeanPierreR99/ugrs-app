module.exports = {
    apps: [
        {
            name: "repositorio",
            script: "node_modules/next/dist/bin/next", // ejecuta Next
            args: "start -p 4007",                     // puerto
            env: {
                NODE_ENV: "development",
                PORT: 4007
            },
            env_production: {
                NODE_ENV: "production",
                PORT: 4007
            },
            dotenv: './.env'
        }
    ]
};