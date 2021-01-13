module.exports = async (data, connection) => {
    let results = [];

    for (let d of data) {
        const images = await connection('images')
            .select({
                image_id: 'id',
                file: 'name',
                path: 'url',
            })
            .where({ variation_id: d.variationId });

        d.images = images;
        results.push(d);
    }

    return results;
};
