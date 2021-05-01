const SizeService = require('../../../../../domain/services/catalog/grids/sizes/Create.service');

class SizeController {
    async create({ body: size }, res) {
        try {
            // check color exist

            // create color
            const data = await SizeService.create({
                payload: size,
            });

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}
module.exports = new SizeController();
