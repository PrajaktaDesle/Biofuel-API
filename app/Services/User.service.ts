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
        console.log(111, data)
        let user = await new UserModel().getUser(data);
        console.log("User", user)
        if(user.length == 0) throw new Error("No Such User Exists");

        //password bcrypt
        const match = await bcrypt.compare(data.password, user[0].password);
        if(match) {
            //login
            console.log("login successfully");

            const token = await Encryption.generateJwtToken(user);
            console.log("token-->",token);
            if(token) {
                // let decoded = Encryption.verifyJwtToken(token)
                // console.log("decoded",decoded);
                user[0].token = token;
                console.log("final----------->",user)
                return user
            }
        }
    }catch(e){
        return e;
    }
}

export default {
    createUser,
    loginUser,
};
