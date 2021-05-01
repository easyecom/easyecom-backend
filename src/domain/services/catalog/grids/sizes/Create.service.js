const SizeRepository = require('../../../../../infra/repository/catalog/grids/sizes/create.repository');

class SizeService {
    async create({ payload }) {
        return await SizeRepository.create({ payload });
    }
}

module.exports = new SizeService();
