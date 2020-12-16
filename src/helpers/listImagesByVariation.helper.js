module.exports = async (variations, connection) => {
    let results = [];

    for (let variation of variations) {
        const images = await connection('images')
            .select({
                image_id: 'id',
                productName: 'name',
                path: 'path',
            })
            .where({ variation_id: variation.variationId });

        variation.images = images;
        results.push(variation);
    }

    return results;
};
