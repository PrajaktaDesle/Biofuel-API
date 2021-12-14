import async from "async";
import bcrypt from "bcrypt";
import {UserModel} from "../Models/User/User.model";

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
    console.log("hash ->", hash)
    let user = await new UserModel().createUser({password: hash});
    console.log("User ->>>>", user);
    return user;
};



async function loginUser(email: string, password: string) {
    try{
        console.log(111, email)
        let user = await new UserModel().getUser(email);
        console.log("User", user)
        if(user.length == 0) throw new Error("No Such User Exists");
        //password bcrypt
        return user
    }catch(e){
        return e;
    }
}

export default {
    createUser,
    loginUser,
};
