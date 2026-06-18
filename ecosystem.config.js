module.exports = {
    apps: [
        {
            name: 'BDG',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
            },
            instances: 2,
            exec_mode: 'cluster',
        },
    ],
};