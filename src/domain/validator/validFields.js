const isValidRequest = data => {
    if (!data || (data.length && !data[0].name)) return { error: true };
    return data;
};

const isValidResponse = data => {
    if (!data.length) return { empty: true };
    return data;
};

const isValidFields = (data, fields) => {
    let validateFields = [];
    validateFields.push(...fields);

    let missingData = [];

    // // valid array
    // if (data.length) {
    //     for (let d of data) {
    //         const errors = validateFields.filter(field => {
    //             if (!d[field]) return field;
    //         });
    //         missingData.push(...errors);
    //     }
    // }

    // if (missingData.length) return { missingData: missingData };

    // valid object
    if (!data.length && data) {
        const errors = validateFields.filter(field => {
            if (!data[field]) return field;
        });
        missingData.push(...errors);
        if (missingData.length) return { error: missingData };
    }

    return data;
};

module.exports = { isValidRequest, isValidResponse, isValidFields };
