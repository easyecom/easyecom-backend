import connection from '../../../../database/connection';

class InactiveCategoriesController {
    async getAll(req, res) {
        const { store_id } = req.params;

        const data = await connection('categories')
            .select('*')
            .where({ isActive: false, store_id: store_id });
        return res.status(200).json(data);
    }

    async getOne(req, res) {
        const { inactive_categoriesId } = req.params;

        const data = await connection('categories')
            .select('*')
            .where({
                id: inactive_categoriesId,
                isActive: false,
                store_id: store_id,
            });
        return res.status(200).json(data);
    }

    async update(req, res) {
        const { inactive_categoriesId, store_id } = req.params;
        const { name, isActive, description } = req.body;

        const data = await connection('categories')
            .where('id', inactive_categoriesId)
            .update({ name, isActive, store_id, description }, [
                'name',
                'isActive',
                'store_id',
                'description',
            ]);
        return res.status(200).json(data);
    }

    async delete(req, res) {
        const { inactive_categoriesId } = req.params;

        await connection('categories')
            .del()
            .where('id', inactive_categoriesId);
        return res.status(200).json('category deleted successfully');
    }
}

export default new InactiveCategoriesController();
