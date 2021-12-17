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

    public static async verifyJwtToken (token : string){
        new Promise(resolve => {
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
}