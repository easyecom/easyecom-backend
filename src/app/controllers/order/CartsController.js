import connection from '../../../database/connection';

class CartsController {
    async create(req, res) {
        const { store_id } = req.params;
        let {
            staticalProduct,
            amount,
            itemsObj,
            itemsArray,
            product_id,
            order_id,
            variation_id,
        } = req.body;

        try {
            const data = await connection('carts')
                .returning('*')
                .insert({
                    staticalProduct,
                    amount,
                    itemsObj,
                    itemsArray,
                    product_id,
                    variation_id,
                    order_id,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            return console.log(err);
        }
    }

    async findAll(req, res) {
        let response = await connection('carts');

        return res.status(200).json(response);
    }

    async findOne({ params }, res) {
        const { store_id, cart_id } = params;
        try {
            let [response] = await connection('carts').where({
                store_id: store_id,
                id: cart_id,
            });

            let itemProducts = [];

            for (let item of response.itemsArray) {
                let variation = await connection('variations')
                    .join('products', 'products.id', 'variations.product_id')
                    .join('brands', 'products.id', 'brands.id')
                    .select(
                        'variations.id',

                        'brands.brand',
                        'variations.product_id',

                        'products.name',
                        'variations.title',
                        'variations.freeShipping',
                        'variations.offerPrice',
                        'variations.salesPrice'
                    )
                    .where({
                        'products.store_id': store_id,
                        'variations.store_id': store_id,
                        'variations.id': `${item.variation_id}`,
                        'brands.store_id': store_id,
                    });
                itemProducts.push(...variation);
            }

            response.itemsArray = itemProducts;

            return res.status(200).json(response);
        } catch (err) {
            return console.error(err);
        }
    }
}

export default new CartsController();
