const connection = require('../../../../database/connection');

class searchProductsController {
    async search(req, res) {
        const { search } = req.query;

        const data = await connection('products');

        if (data.name.includes(`${search}`)) {
            return res.status(200).json(data);
        }

        return res.status(404).json({ message: 'search not found' });
    }
}
module.exports = new searchProductsController();
