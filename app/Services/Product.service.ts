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

let units:any = {"MTS":1,"Tons":2, "Kg":3,"Number":4}, categories:any = {"Briquettes":1,"Pelletes":2, "Loose Biomass":3, "Cashew DOC":4}, status:any = {"active":1,"inactive":2}


const createProduct = async (req: any) => {
    try {
        let productData, fields, files;
        let product: any = {};
        //@ts-ignore
        ({ fields, files } = await new Promise((resolve) => {
            new formidable.IncomingForm().parse(req, async (err: any, fields: any, files: any) => {
                resolve({ fields: fields, files: files });
            })}));
        // Fields validation
        if (fields.name == undefined || fields.name == null || fields.name == "") throw new Error("name is required");
        product.name = fields.name;
        if (fields.category == undefined || fields.category == null || fields.category == "") throw new Error("category is required");
        product.category_id = fields.category
        if (fields.description == undefined || fields.description == null || fields.description == "") throw new Error("description is required");
        product.description = fields.description;
        if (fields.hsn == undefined || fields.hsn == null || fields.hsn == "") throw new Error("hsn is required");
        product.hsn = fields.hsn;
        if (fields.gst == undefined || fields.gst == null || fields.gst == "") throw new Error("gst is required");
        product.gst = fields.gst;
        if (fields.user_id == undefined || fields.user_id == null || fields.user_id == "") throw new Error("user_id is required");
        product.user_id = fields.user_id;
        if (fields.usage_unit == undefined || fields.usage_unit == null || fields.usage_unit == "") throw new Error("usage_unit is required");
        product.usage_unit_id = fields.usage_unit
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
        let category = await new ProductModel().fetchProductCategoryById(product[0].category_id)
        let usage_unit = await new ProductModel().fetchProductUsageUnitById(product[0].usage_unit_id)
        console.log( "product : ", product )
        product[0].category = category[0].name
        product[0].usage_unit = usage_unit[0].name
        delete product[0].usage_unit_id
        delete product[0].category_id
        return product;

    }
    catch (error: any) {
        return error
    }

}

const fetchAllProductCategories= async () => {

    try {
        let productC = await new ProductModel().fetchAllProductCategories()
        if (productC.length == 0) {
            throw new Error("Product categories not found!")
        }
       
        return productC;

    }
    catch (error: any) {
        return error
    }

}

const fetchAllProductUsageUnits= async () => {

    try {
        let productUU = await new ProductModel().fetchAllProductUsageUnits()
        if (productUU.length == 0) {
            throw new Error("Product usagae units not found!")
        }
       
        return productUU;

    }
    catch (error: any) {
        return error
    }

}
const fetchAllProducts = async (id: number) => {

    try {
        let products = await new ProductModel().fetchAllProducts()

        for(let i=0;i< products.length;i++) {
        products[i].image= config.baseUrl + "/" + products[i].image;
        let category = await new ProductModel().fetchProductCategoryById(products[i].category_id)
        let usage_unit = await new ProductModel().fetchProductUsageUnitById(products[i].usage_unit_id)
        products[i].category = category[0].name
        products[i].usage_unit = usage_unit[0].name
        delete products[i].usage_unit_id
        delete products[i].category_id
    }
        return products;

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
        if (fields.gst !== undefined && fields.gst !== null && fields.gst !== "")
            product.gst = fields.gst;
        if (fields.usage_unit !== undefined && fields.usage_unit !== null && fields.usage_unit !== ""){
         product.usage_unit_id = fields.usage_unit }
        if (fields.category !== undefined && fields.category !== null && fields.category !== ""){
        product.category_id=fields.category }
        
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


const updateProductStatus = async (data: any) => {

    try {
        let ProductObj = new ProductModel()
        let product = await new ProductModel().fetchProductById( data.id )
        if( product.length == 0 ) throw new Error( "Product not found")
        let productData = await new ProductModel().updateProductById(data, data.id);
        LOGGER.info( "Product details", productData )
        console.log( productData )
        return {"changedRows":productData.changedRows};
    }
    catch (e){
        throw e; 
    }


}

export default {
    createProduct,
    fetchProductById,
    updateProductById,
    fetchAllProducts,
    updateProductStatus,
    fetchAllProductCategories,
    fetchAllProductUsageUnits
}