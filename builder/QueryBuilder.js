class QueryBuilder {
    // ex: model.find()
    modelQuery;
    // query object
    query;
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    //   searching
    search(searchAbleFields) {
        const searchTerm = this?.query?.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchAbleFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            });
        }
        return this;
    }

    //filtering
    filter() {
        // Creating a shallow copy for immutable delete
        const copiedQueryObject = { ...this?.query };
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        // Removing unnecessary elements from the copiedQueryObject list
        excludeFields.forEach((element) => delete copiedQueryObject[element]);
        console.log(copiedQueryObject)
        this.modelQuery = this.modelQuery.find(copiedQueryObject);
        return this;
    }

    //   sorting
    sort() {
        const sort = this?.query?.sort?.split(",")?.join(" ") || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    //pagination
    paginate() {
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    //   field excluding(select)
    fields() {
        const fields = this?.query?.fields?.split(",")?.join(" ") || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    async meta() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 10;
        const totalPage = Math.ceil(total / limit);
        return {
            page,
            limit,
            totalPage,
            total,
        };
    }
}

module.exports = QueryBuilder;