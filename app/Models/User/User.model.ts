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

    async findUsers(userData:any){
        const userResult= await this._executeQuery("select * from users where tenant_id = ? ",[userData] )
        // console.log("model data--->",userResult);
        return userResult;
    }

    async updateUserDetails(data:any){
        return await this._executeQuery("update users set first_name = ?, middle_name = ?, last_name = ?, email = ?, mobile = ? where id = ? and tenant_id = ? ", [data.first_name, data.middle_name, data.last_name, data.email, data.mobile, data.id, data.tenant_id]);
    }
}
