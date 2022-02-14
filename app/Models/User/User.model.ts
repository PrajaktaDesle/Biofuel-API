import BaseModel from "../BaseModel";

export class UserModel extends BaseModel   {
    constructor() {
        super();
    }
    async getUser(data:any){
        let results = await this._executeQuery("select id,first_name,last_name,email,tenant_id,email,password from users where email = ? AND tenant_id = ? ", [data.email,data.tenant_id]);
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


    async getActiveUsers(tenant_id:number){
        return  await this._executeQuery("select * from users where status = 1 AND tenant_id = ?",[tenant_id] )
        // console.log("model data--->",userResult);

    }
    async fetchUserById(id:number, tenant_id:number){
        return  await this._executeQuery("select * from users where id = ? AND tenant_id = ?",[id,tenant_id] )
        // console.log("model data--->",userResult);

    }

    async updateUserDetails(data:any){
        return await this._executeQuery("update users set ? where id = ? and tenant_id = ? ", [data, data.id, data.tenant_id]);
    }

}
