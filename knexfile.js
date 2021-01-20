require('dotenv').config();

module.exports = {
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './src/infra/database/migrations',
        },
        seeds: { directory: './src/infra/database/seeds' },
        useNullAsDefault: true,
        pool: {
            min: 5,
            max: 10,
        },
    },

    development: {
        client: 'pg',
        connection: {
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
        },
        migrations: {
            directory: './src/infra/database/migrations',
        },
        seeds: { directory: './src/infra/database/seeds' },
        // seeds: { directory: './src/database/seeds' },
        useNullAsDefault: true,
        pool: {
            min: 0,
            max: 10,
        },
    },

    // test: {
    //     client: 'sqlite3',
    //     connection: {
    //         filename: './src/infra/database/dbTest/db.sqlite',
    //     },
    //     useNullAsDefault: true,
    //     migrations: {
    //         directory: './src/infra/database/migrations',
    //     },
    //     dialect: process.env.DB_DIALECT,
    // },
};
