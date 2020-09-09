import connection from '../../../database/connection';

class CardsController {
    async create(req, res) {
        const { store_id } = req.params;
        const {
            fullName,
            areaCode,
            phoneNumber,
            dateOfBirth,
            credit_card_token,
            cpf,
            order_id,
        } = req.body;

        try {
            const data = await connection('cards')
                .returning('*')
                .insert({
                    fullName,
                    areaCode,
                    phoneNumber,
                    dateOfBirth,
                    credit_card_token,
                    cpf,
                    order_id,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            return console.log(err);
        }
    }

    async findAll(req, res){
        const data = await connection('cards')
        return res.status(200).json(data)
    }
}

export default new CardsController();
