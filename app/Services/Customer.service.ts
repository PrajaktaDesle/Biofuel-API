import async from "async";

import bcrypt from "bcrypt";

const jwt = require('jsonwebtoken');
import {CustomerModel} from "../Models/Customer/Customer.model";
import Encryption from "../utilities/Encryption";
import * as path from "path";
import * as fs from "fs";
import userService from "./User.service";

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


const createCustomer = async (form : any,req:any,tenant:any) =>{
    let customerData;
    form.parse(req, async (err: any, fields: any, files: any) =>{

    const data: any [] = [];
    const data_path: string [] = [];
    // let fieldData: any [] = []
    let newPath: string [] = []
    const images = Object.keys(files)

    for (let i = 0; i < images.length; i++) {
        data.push(files[images[i]])
        const new_data = data[i]
        data_path[i] = new_data.filepath
        // console.log(data_path[i])
        // oldPath[i] = data_path[i]
        newPath[i] = path.join(__dirname, '../uploads')
            + '/' + data[i].originalFilename
        let rawData = fs.readFileSync(data_path[i])

        fs.writeFile(newPath[i], rawData, function (err) {
            if (err) console.log(err)
            // return res.send("Successfully uploaded")
        })
    }
        let hash = await generateHash(fields.password, 10);

        const pancard_url = newPath[0]
        const aadhar_url = newPath[1]
        const first_name = String(fields.f_name)
        const middle_name = String(fields.m_name)
        const last_name = String(fields.l_name)
        const mobile = String(fields.mobile)
        const email = String(fields.email)
        // const password = String(fields.password)
        const dob = String(fields.dob)
        const reg_date = String(fields.r_date)
        const user_id = Number(fields.u_id)
        // const tenant_id = Number(tenant)
        const status = Number(fields.stat)
        const pan_number = String(fields.pan_num)
        const aadhar_number = String(fields.aadhar_num)
        const address = String(fields.address)

        console.log(pancard_url)

        let Customers = {
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            mobile: mobile,
            email: email,
            password: hash,
            dob: dob,
            reg_date: reg_date,
            user_id: user_id,
            tenant_id: tenant,
            status: status,
            pancard_url: pancard_url,
            aadhar_url: aadhar_url,
            pan_number: pan_number,
            aadhar_number: aadhar_number,
            address: address
        }
        console.log("Customers json at services-------->",Customers);
        customerData = await new CustomerModel().createCustomer(Customers)
        if (!customerData) throw new Error("Registration failed");
            console.log("user returned from model------>", customerData)
            return customerData.insertId;
    })
}

//
// const loginCustomer = async (data : any) =>{
//
//
//     return;
// }

export default {
    createCustomer,
    // loginCustomer,
};