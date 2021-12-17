import BaseModel from "../BaseModel";

export class UserModel extends BaseModel   {
    constructor() {
        super();
    }
    async getUser(data:any){
        let results = await this._executeQuery("select id,tenant_id,email,password from users where email = ? AND tenant_id = ? ", [data.email,data.tenant_id]);
        return results;
    }
    async createUser(userData:any){
        let registerResult = await this._executeQuery("insert into users set ?",[userData]);
        return registerResult;
    }
}
