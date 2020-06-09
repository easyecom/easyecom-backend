import Sequelize, { Model } from 'sequelize';

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                BrandId: Sequelize.INTEGER,
                CategoryId: Sequelize.INTEGER,
                name: Sequelize.STRING,
                size: Sequelize.STRING,
                color: Sequelize.STRING,
                DescriptionShort: Sequelize.STRING,
                description: Sequelize.STRING,
                IsActive: Sequelize.BOOLEAN,
                IsVisible: Sequelize.BOOLEAN,
                KeyWords: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default Product;
