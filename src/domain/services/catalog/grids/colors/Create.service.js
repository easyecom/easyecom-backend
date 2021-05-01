const ColorRepository = require('../../../../../infra/repository/catalog/grids/colors/create.repository');

class ColorService {
    async create({ payload }) {
        return await ColorRepository.create({ payload });
    }
}

module.exports = new ColorService();
