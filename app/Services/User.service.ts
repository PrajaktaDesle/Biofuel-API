import async from "async";

import bcrypt from "bcrypt";

const jwt = require('jsonwebtoken');
import {UserModel} from "../Models/User/User.model";
import Encryption from "../utilities/Encryption";
import LOGGER from "../config/LOGGER";

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

const createUser = async (
    data : any
) => {
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
        let user = await new UserModel().getUser(data);
        LOGGER.info("User from DB ->", user);
        if(user.length == 0) throw new Error("No Such User Exists");
        //password bcrypt
        const match = await bcrypt.compare(data.password, user[0].password);
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
