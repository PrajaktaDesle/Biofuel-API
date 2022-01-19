import {reject} from "async";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("../config");
import fs from "fs";
import AWS from 'aws-sdk';

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

export default class Encryption {
    constructor() {

    }

    public static async generateJwtToken(data: any) {
        console.log("before token", data)
        return await jwt.sign(data, config.JwtToken.secretKey, {expiresIn: config.JwtToken.expiry});
    }

    public async verifyJwtToken(token: string | string[]): Promise<any> {
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

    public async generateHash (password: string, saltRounds: number): Promise<any> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err: any, hash: any) => {
                if (!err) {
                    resolve(hash);
                }
                reject(err);
            });
        });
    }

    public async verifypassword (password: string, hashPassword: string): Promise<any> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hashPassword, (err: any, hash: any) => {
                if (!err) {
                    resolve(hash);
                }
                reject(err);
            });
        });
    }
}
