import Product from '../models/Product';

class ProductController {
    async create(req, res) {
        const {
            BrandId,
            CategoryId,
            name,
            size,
            color,
            DescriptionShort,
            description,
            IsActive,
            IsVisible,
            KeyWords,
        } = req.body;

        const product = await Product.create({
            BrandId,
            CategoryId,
            name,
            size,
            color,
            DescriptionShort,
            description,
            IsActive,
            IsVisible,
            KeyWords,
        });
        return res.json(product);
    }

    async getAll(req, res) {
        const { id } = req.params;

        const product = await Product.findAll({ id });

        return res.json(product);
    }

    async getById(req, res) {
        const { id } = req.params;

        const amount = await Product.findByPk(id);

        return res.json(amount);
    }
}

export default new ProductController();
