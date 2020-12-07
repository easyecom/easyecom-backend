module.exports = async (data, connection) => {
    const result = await connection('images')
        .returning('*')
        .insert({
            name: "register name",
            path: 'register path image',
            product_id: data && data.productId ? data.productId : undefined,  
            variation_id: data && data.variationId ? data.variationId : undefined,  
            category_id: data && data.categoryId ? data.categoryId : undefined,  
            brand_id: data && data.brandId ? data.brandId : undefined,   
        });
    console.table(result);
};
