import BaseModel from "../BaseModel";

export class TcModel extends BaseModel {
    constructor() {
        super();
    }
    async createTc(data: any) {
        return await this._executeQuery("insert into transaction_config set ?", [data]);
    }

    async fetchTc(tenant_id: any, transaction_type: string) {
        return await this._executeQuery("select amount,tenure,maturity_amount from transaction_config where tenant_id = ? and transaction_type = ?", [tenant_id,transaction_type]);
    }
}
