module.exports = async (data, connection) => {
    let ProductAllAndVariationImages = [];

    for (let d of data) {
        const images = await connection('images')
            .select({
                image_id: 'id',
                file: 'name',
                path: 'url',
            })
            .where({ variation_id: d.variationId });

        d.images = images;
        ProductAllAndVariationImages.push(d);
    }

    return ProductAllAndVariationImages;
};
