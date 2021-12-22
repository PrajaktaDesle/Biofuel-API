import {reject} from "async";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("../config");
export default class Encryption{
    constructor() {

    }

    public static async generateJwtToken (data : any){
       // return "data"
        // console.log("gsgsgsggssgs--->",'test',config.JwtToken.secretKey,config.JwtToken.expiry)
        return await jwt.sign(data, config.JwtToken.secretKey,{expiresIn:config.JwtToken.expiry});
        // const token = jwt.sign({ user_id: user._id}, process.env.TOKEN_KEY, { expiresIn: "2h",});
    }

    public async verifyJwtToken(token: string | string[]):Promise<any>{
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                config.JwtToken.secretKey,
                (err: Error, decoded: any) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(decoded);
                    }
                },
            );
        });
    }


   public static generateHash = async (
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

    public static verifypassword = async (
        password: string,
        hashPassword: string,
    ): Promise<string> =>
        new Promise((resolve, reject) => {
            bcrypt.compare(password, hashPassword, (err: any, hash: string) => {
                if (!err) {
                    resolve(hash);
                }
                reject(err);
            });
        });
    }
}
