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

    async Get(filter){
        const res = await this.#modelName.findOne(filter);
        return res;
    }

    async Delete(id){
        const res = await this.#modelName.findOneAndDelete({_id : id});
        return res;
    }
}