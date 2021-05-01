const ColorService = require('../../../../../domain/services/catalog/grids/colors/Create.service');

class ColorController {
    async create({ body: colors }, res) {
        try {
            // check color exist

            // create color
            const data = await ColorService.create({
                payload: colors,
            });

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}
module.exports = new ColorController();
