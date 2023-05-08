module.exports = {
    apps: [
        {
            name: 'BDG',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
            },
            instances: 'max',
            exec_mode: 'cluster',
        },
    ],
};