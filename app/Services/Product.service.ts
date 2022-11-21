import { ProductModel } from "../Models/Product/Product.model";
import { uploadFile, uploadFiles } from "../utilities/S3Bucket";
const { v4: uuidv4 } = require('uuid');
import LOGGER from '../config/LOGGER';
let config = require('../config')
import formidable from "formidable";
import moment from 'moment';
import Encryption from "../utilities/Encryption";
import path, { resolve } from "path";
import { off } from "process";
const fs = require('fs')
import AWS from 'aws-sdk';
let units:any = {"MTS":1,"Tons":2, "Kg":3,"Number":4}, categories:any = {"briquetts":1}


const createProduct = async (req: any) => {
    try {
        let productData, fields, files;
        let product: any = {};
        //@ts-ignore
        ({ fields, files } = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({ fields: fields, files: files });
            })}));
        let units:any = {"MTS":1,"Tons":2, "Kg":3,"Number":4}, categories:any = {"briquetts":1}
        // Fields validation
        if (fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
        product.name = fields.name;
        if (fields.category == undefined || fields.category == null || fields.category == "") throw new Error("category is required");
        if( Object.keys(categories).includes(fields.category) ) product.category_id = categories[fields.category]
        if (fields.description == undefined || fields.description == null || fields.description == "") throw new Error("description is required");
        product.description = fields.description;
        if (fields.hsn == undefined || fields.hsn == null || fields.hsn == "") throw new Error("hsn is required");
        product.hsn = fields.hsn;
        if (fields.packing == undefined || fields.packing == null || fields.packing == "") throw new Error("packing is required");
        product.packing = fields.packing;
        if (fields.gst == undefined || fields.gst == null || fields.gst == "") throw new Error("gst is required");
        product.gst = fields.gst;
        if (fields.user_id == undefined || fields.user_id == null || fields.user_id == "") throw new Error("user_id is required");
        product.user_id = fields.user_id;
        if (fields.unit == undefined || fields.unit == null || fields.unit == "") throw new Error("unit is required");
        product.unit_id = units[fields.unit]
        if (fields.status == undefined || fields.status == null || fields.status == "") throw new Error("status is required");
        product.status = fields.status;
       
        // Files validation
        let s3Image: any = {}
        let s3Path: any = {}
        if (files.image !== undefined && files.image !== null && files.image !== "") {
            if (fileNotValid(files.image.mimetype)) throw new Error("Only .png, .jpg and .jpeg format allowed! for image"); s3Image['image'] = files.image
        }
        else { throw new Error("image is required") }
        let name: string = "images/image/" + moment().unix() + "." + s3Image['image'].originalFilename.split(".").pop()
        const result = await uploadFile(s3Image['image'], name);
        if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
        console.log("s3 result  : ", result)
        s3Path['image'] = result.key;
        product = Object.assign(product, s3Path);
 
        console.log( "product : ", product )
        productData = await new ProductModel().createProduct(product)
        return productData;

    } catch (e: any) {
        console.log("Exception =>", e.message);
        throw e;
    }
}

const fileNotValid = (type: any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
        return false;
    }
    return true;
};

const fetchProductById = async (id: number) => {

    try {
        let product = await new ProductModel().fetchProductById(id)
        if (product.length == 0) {
            throw new Error("Product not found!")
        }
        product[0].usage_unit = Object.keys(units)[product[0].usage_unit_id]
        delete product[0].usage_unit_id
        console.log( "product : ", product )
        return product;

    }
    catch (error: any) {
        return error
    }

}

const updateProductById = async (req: any) => {

    try {
        let product: any = {}
        let fields, files;
        //@ts-ignore
        ({ fields, files } = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({ fields: fields, files: files })
            })
        }))
        let units:any = {"MTS":1,"Tons":2, "Kg":3,"Number":4}, categories:any = {"briquetts":1}
        if (fields.id == undefined || fields.id == null || fields.id == "") throw new Error("id is missing");

        // supplier exists or not
        let pd = await new ProductModel().fetchProductById(fields.id)
        if (pd.length == 0) throw new Error("Product not found!")

        // Fields validation
        if (fields.name !== undefined && fields.name !== null && fields.name !== "")
            product.name = fields.name;
        if (fields.description !== undefined && fields.description !== null && fields.description !== "")
            product.description = fields.description;
        if (fields.hsn !== undefined && fields.hsn !== null && fields.hsn !== "")
            product.hsn = fields.hsn;
        if (fields.packing !== undefined && fields.packing !== null && fields.packing !== "")
            product.packing = fields.packing;
        if (fields.gst !== undefined && fields.gst !== null && fields.gst !== "")
            product.gst = fields.gst;
        if (fields.unit !== undefined && fields.unit !== null && fields.unit !== ""){
         product.usage_unit_id = units[fields.usage_unit]}
        if (fields.category !== undefined && fields.category !== null && fields.category !== ""){
        product.category_id=categories[fields.category]}
        
        // Files validation
        if (files.image !== undefined && files.image !== null && files.image !== "") {
            if (fileNotValid(files.image.mimetype)){ throw new Error("Only .png, .jpg and .jpeg format allowed! for image") }
            else{ 
                  let name: string = "images/image/" + moment().unix() + "." + files['image'].originalFilename.split(".").pop()
                  const result = await uploadFile(files['image'], name);
                  if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
                  console.log("s3 result  : ", result)
                  product['image'] = result.key;
                }
        }
        console.log( 'product : ',product )
        let productData = await new ProductModel().updateProductById( product, fields.id )
        return productData;

    }
    catch (error: any) {
        return error
    }


}


export default {
    createProduct,
    fetchProductById,
    updateProductById
}