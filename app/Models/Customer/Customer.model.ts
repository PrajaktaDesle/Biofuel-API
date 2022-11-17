import UserModel from "../User/User.model";
import {Connection} from "mysql2";

export class CustomerModel extends UserModel
{
    constructor()
    {
        super();
    }

    async createCustomerAddress(addressData:any){
        return await this._executeQuery("insert into addresses set ?", [addressData]);
    }
    async createCustomerProfile(profileData:any){
        return await this._executeQuery("insert into users_profile set ?", [profileData]);
    }
    async updateCustomersProfileDetails(customerData:any,id:number){
        return await this._executeQuery("update users_profile set ? where user_id = ? ", [customerData,id]);
    }
    async updateCustomersAddressDetails(customerData:any,id:number){
        return await this._executeQuery("update addressses set ? where user_id = ? ", [customerData,id]);
    }
    async fetchCustomersProfileById(id: any ){
        return await this._executeQuery("select gstin_no from users_profile where user_id = ? ", [id]);
    }  
    async fetchCustomersAddressById(id: number, type : string ){
        return await this._executeQuery("select address, pincode, city from addresses where user_id = ? and address_type = ? ", [id, type]);
    }
   
}