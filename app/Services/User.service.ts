import async from "async";
import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken');
import {UserModel} from "../Models/User/User.model";
import Encryption from "../utilities/Encryption";
import LOGGER from "../config/LOGGER";


const createUser = async (data : any) => {

    if(data.password!==data.confirm_password) throw new Error("password did not match");
    let hash = await Encryption.generateHash(data.password, 10);
    data.password = hash;
    // console.log(data)
    delete data.confirm_password;
    // console.log(data)
    let user = await new UserModel().createUser(data);
    console.log("User ->>>>", user);
    return user;
};

async function loginUser(data:any) {
    try{
        let user = await new UserModel().getUser(data);
        LOGGER.info("User from DB ->", user);
        if(user.length == 0) throw new Error("No Such User Exists");
        //password bcrypt
        const match =await Encryption.verifypassword(data.password, user[0].password);
        // const match = await bcrypt.compare(data.password, user[0].password);
        if(!match) throw new Error("Invalid password");
        const token = await Encryption.generateJwtToken({id : user.id, tenant_id:user.tenant_id});
        user[0].token = token;
        return user;
    }catch(e){
        return e;
    }
}

export default {
    createUser,
    loginUser,
};
