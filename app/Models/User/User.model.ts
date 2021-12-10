import BaseModel from "../BaseModel";

export class UserModel extends BaseModel   {
    constructor() {
        super();
    }

    async getUser(email : string){
        let results = await this._excuteQuery("select * from users where email = ?;", [email]);
        return results;
    }

}

//export default UserModel;