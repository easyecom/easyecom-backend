const connection = require('../../../../database/connection');

class variationImagesController {
    async updateImages(req, res) {
        try {
            const { store_id } = req.params;
            const checkVariation = await connection('images').where({
                store_id: store_id,
            });

            if (!checkVariation.length) {
                return res
                    .status(400)
                    .json({ error: 'variation does not exist.' });
            }

            const newImages = req.files.map(item => item.filename);
            variations.images = variations.images
                .filter(item => item)
                .concat(newImages);

            return res.status(200).json({ variation });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new variationImagesController();
