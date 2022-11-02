import BaseModel from "../BaseModel";

export class AdminModel extends BaseModel{
    constructor()
    {
        super();
    }

    async getAdmin( data : any ){
        return await this._executeQuery( "select * from admin where email = ? and password = ? ", [data.email, data.password])
    }
}