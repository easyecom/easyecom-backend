module.exports = async (variations, connection) => {
    let variationImages = [];

    for (let variation of variations) {
        const images = await connection('images')
            .select({
                image_id: 'id',
                file: 'name',
                path: 'url',
            })
            .where({ variation_id: variation.variationId });

        variation.images = images;
        variationImages.push(variation);
    }

    return variationImages;
};
