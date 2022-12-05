import UserModel from "../User/User.model";

export class AddressModel extends UserModel{
    constructor()
    {
        super();
    }

    async createAddress( data : any ){
        return await this._executeQuery( "INSERT INTO addresses SET ? ", [data])
    }
}