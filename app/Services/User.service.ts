import async from "async";

import bcrypt from "bcrypt";

const jwt = require('jsonwebtoken');
import {UserModel} from "../Models/User/User.model";
import Encryption from "../utilities/Encryption";

const generateHash = async (
    password: string,
    saltRounds: number,
): Promise<string> =>
    new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
            if (!err) {
                resolve(hash);
            }
            reject(err);
        });
    });

const createUser = async (data : any) => {

    if(data.password!==data.confirm_password) throw new Error("password did not match");
    let hash = await generateHash(data.password, 10);
    data.password = hash;
    console.log(data)
    delete data.confirm_password;
    console.log(data)
    let user = await new UserModel().createUser(data);
    console.log("User ->>>>", user);
    return user;
};

async function loginUser(data:any) {
    try{
        console.log(111, data)
        let user = await new UserModel().getUser(data);
        console.log("User", user)
        if(user.length == 0) throw new Error("No Such User Exists");
        const match = await bcrypt.compare(data.password, user[0].password);
        if(!match) throw new Error("Password did not match");
            const token = await Encryption.generateJwtToken({ tenant_id:user.tenant_id,user_id:data.id});
                user[0].token = token;
                // delete user.password;
                return user
    }catch(e){
        return e;
    }
}

export default {
    createUser,
    loginUser,
};
