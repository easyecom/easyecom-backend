class ParallelAssociate {
    constructor({ items, item2, repository, method }) {
        this.items = items;
        this.repository = repository;
        this.method = method;
        this.item2 = item2;
    }

    async execute() {
        const response = [];

        for (const item of await this.items) {
            const data = await this.repository[this.method](item, this.item2);

            response.push(...data);
        }

        return response;
        // add logger
    }
}

module.exports = ParallelAssociate;
