import connection from '../../../database/connection';

class CartsController {
    async create(req, res) {
        const { store_id } = req.params;
        const {
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

    async findAll(req, res){
        const data = await connection('carts')
        return res.status(200).json(data)
    }
}

export default new CartsController();
