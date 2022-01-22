import BaseModel from "../BaseModel";

export class SukanyaYojnaModel extends BaseModel {
    constructor() {
        super();
    }
    async createSukanyaYojna(data: any) {
        return await this._executeQuery("insert into sukanyaYojna set ?", [data]);
    }
}