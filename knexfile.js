require('dotenv').config();

module.exports = {
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './src/database/migrations',
        },
        seeds: { directory: './src/database/seeds' },
        useNullAsDefault: true,
        pool: {
            min: 5,
            max: 10,
        },
    },

    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
        },
        migrations: {
            directory: './src/database/migrations',
        },
        seeds: { directory: './src/database/seeds' },
        // seeds: { directory: './src/database/seeds' },
        useNullAsDefault: true,
        pool: {
            min: 0,
            max: 10,
        },
    },

    staging: {
        client: 'pg',
        connection: {
            host: process.env.DATABASE_STAGE_HOST,
            database: process.env.DATABASE_STAGE_NAME,
            port: process.env.DATABASE_STAGE_PORT,
            user: process.env.DATABASE_STAGE_USER,
            password: process.env.DATABASE_STAGE_PASSWORD,
        },
        migrations: {
            directory: './src/database/migrations',
        },
        seeds: { directory: './src/database/seeds' },
        pool: {
            min: 2,
            max: 10,
        },
    },
};
