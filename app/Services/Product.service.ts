import {ProductModel} from "../Models/Product/Product.model";
import { uploadFile, uploadFiles } from "../utilities/S3Bucket";
const { v4 : uuidv4} = require('uuid');
import LOGGER from '../config/LOGGER';
let config = require('../config')
import formidable from "formidable";
import moment from 'moment';
import Encryption from "../utilities/Encryption";
import path, { resolve } from "path";
import { off } from "process";
const fs  = require('fs')
import AWS from 'aws-sdk';


const createProduct = async ( req: any ) => {
    try{
        let productData, fields, files;
        let product: any = {};
        //@ts-ignore
        ({fields, files} = await new Promise( (resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({fields: fields, files: files});})}));

         // Fields validation
         if(fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
         product.name=fields.name;
         if(fields.description == undefined || fields.description == null || fields.description == "") throw new Error("description is required");
         product.description=fields.description;
         if(fields.hsn == undefined || fields.hsn == null || fields.hsn == "") throw new Error("hsn is required");
         product.hsn=fields.hsn;
         if(fields.weight == undefined || fields.weight == null || fields.weight == "") throw new Error("weight is required");
         product.weight=fields.weight;      
         if(fields.pack_size == undefined || fields.pack_size == null || fields.pack_size == "") throw new Error("pack_size is required");
         product.pack_size=fields.pack_size;
         if(fields.grade == undefined || fields.grade == null || fields.grade == "") throw new Error("grade is required");
         product.grade=fields.grade;
         if(fields.rm == undefined || fields.rm == null || fields.rm == "") throw new Error("rm is required");
         product.rm=fields.rm;
         if(fields.gcv == undefined || fields.gcv == null || fields.gcv == "") throw new Error("gcv is required");
         product.gcv=fields.gcv;
         if(fields.ash == undefined || fields.ash == null || fields.ash == "") throw new Error("ash is required");
         product.ash=fields.ash
         if(fields.moisture == undefined || fields.moisture == null || fields.moisture == "") throw new Error("moisture is required");
         product.moisture=fields.moisture
         if(fields.packing == undefined || fields.packing == null || fields.packing == "") throw new Error("packing is required");
         product.packing=fields.packing
         if(fields.user_id == undefined || fields.user_id == null || fields.user_id == "") throw new Error("user_id is required");  
         product.user_id=fields.user_id;
         if(fields.status == undefined || fields.status == null || fields.status == "") throw new Error("status is required");
         product.status=fields.status;
        
         // Files validation
         let s3Image:any = {}
         let s3Path:any = {}
         if(files.image !== undefined && files.image !== null && files.image !== ""){
         if(isFileValid(files.image.mimetype))throw new Error("Only .png, .jpg and .jpeg format allowed! for image");s3Image['image'] = files.image}
         else{throw new Error("image is required")}
         let name : string = "images/image/"+  moment().unix() + "."+ s3Image['image'].originalFilename.split(".").pop()
         const result = await uploadFile( s3Image['image'], name );
         if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
         console.log( "s3 result  : ", result)
         s3Path['image'] = result.key;
         product = Object.assign(product, s3Path);
       
         productData = await new ProductModel().createProduct(product)
         return productData;
    
}catch(e:any){
    console.log("Exception =>", e.message);
    throw e;
}
}

const isFileValid = (type:any) => {
    if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png') {
      return false;
    }
    return true;
  };


export default {
    createProduct
}