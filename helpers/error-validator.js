class RequestValidator {
    constructor(errors, request) {
        this.errors = errors;
        this.request = request;
    }

    async check() {
        const error = await this.errors.filter(prop =>
            !this.request.body[prop] && !this.request.params[prop] ? prop : ''
        );

        if (error.length > 0) {
            return {
                status: 422,
                json: {
                    error: 'Missing params',
                    required: error,
                },
            };
        }
    }
}
module.exports = RequestValidator;
