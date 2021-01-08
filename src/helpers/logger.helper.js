class Logger {
    start() {
        return console.log(`\n >> LOGGER START <<`);
    }

    success({ entity, message, data }) {
        try {
            return console.log(
                '\x1b[32m',
                `> [${entity}] ${message} \n ${data}`
            );
        } catch (err) {
            console.log(err);
        }
    }

    error({ entity, message, data }) {
        return console.log('\x1b[31m', `> [${entity}] ${message} \n ${data}`);
    }
}

module.exports = new Logger();
