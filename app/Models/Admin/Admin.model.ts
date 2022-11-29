import UserModel from "../User/User.model";

export class AdminModel extends UserModel{
    constructor()
    {
        super();
    }

    async getAdmin( data : any ){
        return await this._executeQuery( "select id, email, name as username, status from user where email = ? and password = ? ", [data.email, data.password])
    }
}