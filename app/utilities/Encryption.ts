const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("../config");
export default class Encryption{
    constructor() {

    }


    public static async generateJwtToken (data : any){
        return await jwt.sign({ data }, config.env.authSecret, {
            expiresIn: config.timers.userCookieExpiry,
        });
    }

    public static async verifyJwtToken (token : string){
        new Promise(resolve => {
            jwt.verify(
                token,
                config.env.authSecret,
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
}