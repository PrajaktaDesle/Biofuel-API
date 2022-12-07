import UserModel from "../User/User.model";

export class AddressModel extends UserModel{
    constructor()
    {
        super();
    }

    async createAddress( data : any ){
        return await this._executeQuery( "INSERT INTO addresses SET ? ", [data])
    }
    async updateAddress( data : any , user_id:number, address_type:number){
        return await this._executeQuery( " update addresses SET ? where user_id = ? and address_type = ?", [data, user_id, address_type])
    }
}