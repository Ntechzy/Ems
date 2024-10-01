export class FilterData {
    #filterFieldsStr;
    #queryResponse;

    constructor(queryResponse) {
        this.#queryResponse = queryResponse;
    }

    filterByFields(filterFieldsStr) {
        try {
            this.#filterFieldsStr = filterFieldsStr;
            if (!this.#filterFieldsStr || this.#filterFieldsStr.length === 0) {
                return new Error("Please provide fields to filter");
            }

            const fields = this.#filterFieldsStr.split(",").map(field => field.trim());
            let response;

            if (Array.isArray(this.#queryResponse)) {
                response = this.#queryResponse.map(obj => {
                    return fields.reduce((acc, field) => {
                        if (field in obj) {
                            acc[field] = obj[field];
                        }
                        return acc;
                    }, {});
                });
            } else if (typeof this.#queryResponse === "object" && this.#queryResponse !== null) {
                response = fields.reduce((acc, field) => {
                    if (field in this.#queryResponse) {
                        acc[field] = this.#queryResponse[field];
                    }
                    return acc;
                }, {});
            } else {
                return new Error("Query response must be an array or an object");
            }

            return response;

        } catch (err) {
            throw err;
        }
    }
}
