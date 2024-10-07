export class Base {
    #modelName;
    constructor(modelName){
        this.#modelName = modelName;
    }

    async Create(data){
        const res = await this.#modelName.create(data);
        return res;
    }

    async GetAll(){
        const res = await this.#modelName.find({});
        return res;
    }

    async GetWithPagination(filter , offset , limit){
        const res = await this.#modelName.find(filter).skip(offset).limit(limit);
        return res;
    }

    async Get(filter){
        const res = await this.#modelName.findOne(filter);
        return res;
    }

    async Update(filter , dataToUpdate){
        const res = await this.#modelName.findOneAndUpdate(filter , dataToUpdate);
        return res;
    }

    async Delete(id){
        const res = await this.#modelName.findOneAndDelete({_id : id});
        return res;
    }

    async GetByFilters(filters){
        const res = await this.#modelName.find(filters).exec();
        return res;
    }
}