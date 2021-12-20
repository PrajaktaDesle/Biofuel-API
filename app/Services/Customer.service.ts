import async from "async";

import bcrypt from "bcrypt";

const jwt = require('jsonwebtoken');
import {CustomerModel} from "../Models/Customer/Customer.model";
import Encryption from "../utilities/Encryption";
import * as path from "path";
import * as fs from "fs";

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

const createCustomer = async (form : any,tenant:any) =>{
    let customerData;
    form.parse(async (err: any, fields: any, files: any) =>{

    const data: any [] = [];
    const data_path: string [] = [];
    // let fieldData: any [] = []
    let newPath: string [] = []
    const images = Object.keys(files)

    for (let i = 0; i < images.length; i++) {
        data.push(files[images[i]])
        const new_data = data[i]
        data_path[i] = new_data.filepath
        newPath[i] = path.join(__dirname, '../uploads')
            + '/' + data[i].originalFilename
        let rawData = fs.readFileSync(data_path[i])

        fs.writeFile(newPath[i], rawData, function (err) {
            if (err) console.log(err)
        })
    }
        let hash = await generateHash(fields.password, 10);
        let Customers = {
            first_name: String(fields.f_name),
            middle_name: String(fields.m_name),
            last_name: String(fields.l_name),
            mobile: String(fields.mobile),
            email: String(fields.email),
            password: hash,
            dob: String(fields.dob),
            reg_date: String(fields.r_date),
            user_id: Number(fields.u_id),
            tenant_id: tenant,
            status: Number(fields.stat),
            pancard_url: newPath[0],
            aadhar_url: newPath[1],
            pan_number: String(fields.pan_num),
            aadhar_number: String(fields.aadhar_num),
            address: String(fields.address)
        }
        console.log("Customers json at services-------->",Customers);
        customerData = await new CustomerModel().createCustomer(Customers)
        if (!customerData) throw new Error("Registration failed");
            console.log("details returned from model------>", customerData)
            return customerData.insertId;
    })
}


const customerDetails = async (data : any) =>{
    let customerData;
customerData = await new CustomerModel().findCustomers(data)
        if (!customerData) throw new Error("details did not match");
        console.log("details returned from model------>", customerData)
        return customerData;
}

export default {
    createCustomer,
    // loginCustomer,
    customerDetails,
};