module.exports = async totalValue => {
    let value = 0;

    // const total = totalValue.reduce((prev, acc) => prev + acc.value, 0);

    for (let i = 0; i < totalValue.length; i++) {
        value = value += totalValue[i];
    }

    return value;
};
