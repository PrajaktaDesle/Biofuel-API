import BaseModel from "../BaseModel";

export  default class UserModel extends BaseModel   {
    constructor() {
        super();
    }
    async fetchUserById(id:number, role_id: number){
        let results = await this._executeQuery("select id, name,email, mobile, status, created_at, updated_at from user where id = ? AND role_id = ? ", [id,role_id]);
        return results;
    }

    async fetchUserByMobile(mobile:number, role_id: number){
        let results = await this._executeQuery("select id,name,email, mobile, status, created_at, updated_at from user where mobile = ? AND role_id = ? ", [mobile,role_id]);
        return results;
    }

    async createUser(userData:any){
        let registerResult = await this._executeQuery("insert into user set ?",[userData]);
        return registerResult;
    }

    async fetchAllUsers(role_id:number){
        const userResult= await this._executeQuery("select id, name, email, mobile, status, created_at, updated_at from user where role_id = ? order by status desc  ",[role_id] )
        return userResult;
    }

    async getActiveUsers(role_id:number){
        return  await this._executeQuery("select * from user where status = 1 AND role_id = ?",[role_id] )
    }

    async updateUserDetails(data:any, id:number, role_id:number){
        return await this._executeQuery("update user set ? where id = ? and role_id = ? ", [data, id, role_id]);
    }

    async updateCityDetails(data:any, id:number){
        return await this._executeQuery("update address_city set ? where id = ?  ", [data, id]);
    }

    async getAllCities(){
        return await this._executeQuery("select id as value, name as label from address_city",[])
    }

    async getAllStates(){
        return await this._executeQuery( "select id as value, name as label from address_state",[])
    }
   
    async getAllCityWiseStates(id:number){
        return await this._executeQuery("select act.id as city_id, act.name as city , ast.id as state_id, ast.name as state from biofuel.address_city act inner join biofuel.address_state ast ON  act.state_id = ast.id where act.id = ?",[id])
    }

    async getCity(name:string){
        return await this._executeQuery( "select id from address_city where name = ? ",[name])
    }

    async getCityById(id:number){
        return await this._executeQuery( "select * from address_city where id = ? ",[id])
    }

    async getStateById(id:number){
        return await this._executeQuery( "select * from address_state where id = ? ",[id])
    }
    async getState(name:string){
        return await this._executeQuery( "select id from address_state where name = ?",[name])
    }

}
