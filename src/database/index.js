import Sequelize from 'sequelize';

import Product from '../app/models/Product';

import databaseConfig from '../config/database';

const models = [Product];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection));
    }
}

export default new Database();
