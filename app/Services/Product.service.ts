import { ProductModel } from "../Models/Product/Product.model";
import { uploadFile, uploadFiles } from "../utilities/S3Bucket";
let config = require('../config')
import formidable from "formidable";
import moment from 'moment';
const fs = require('fs')



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
        product.igst = fields.gst;
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
            let name: string = "images/image/" + moment().unix() + "." + s3Image['image'].originalFilename.split(".").pop()
            const result = await uploadFile(s3Image['image'], name);
            if (result == 0 && result == undefined) throw new Error("Product image upload to s3 failed");
            console.log("s3 result  : ", result)
            s3Path['image'] = result.key;
            product = Object.assign(product, s3Path);
        }
       
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
        product[0].image= config.baseUrl + "/" + product[0].image;
        product[0].category = {label : product[0].category , value : product[0].category_id};
        product[0].usage_unit = {label : product[0].usage_unit , value : product[0].usage_unit_id};
        //product[0].imgList = [{file : product[0].image}]
        product[0].imgList = [{ file :"https://picsum.photos/200/300"}]
        if (product[0].status == 1){
            product[0].status = {value : 1, label : "Active"};
        }else{
            product[0].status = {value : 0, label : "Inactive"};
        }
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

const fetchAllProducts = async (pageIndex: number, pageSize : number, sort : any, query : string) => {
    try {
        let orderQuery : string;
        if(sort.key != ""){
            orderQuery = " ORDER BY "+ sort.key + " "+ sort.order +" ";
        } else{
            orderQuery = " ORDER BY p.status DESC";
        }
        let products = await new ProductModel().fetchAllProducts(pageSize, (pageIndex-1) * pageSize, orderQuery, query)
        for(let i=0;i< products.length;i++) {
            products[i].image= config.baseUrl + "/" + products[i].image;
        }
        return products;
    }
    catch (error: any) {
        return error
    }
}

const fetchAllProductCount = async (query: string) => {
    try {
        let products = await new ProductModel().fetchAllProductCount(query);
        return products.length;
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
            product.igst = fields.gst;
        if (fields.status !== undefined && fields.status !== null && fields.status !== "")
            product.status = fields.status;
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



const fetchAllProductRawMaterials = async ( ) =>{
    let data = await new ProductModel().fetchAllProductRawMaterials()
    if (data.length == 0) {
            throw new Error("Raw materials not found!")
        }
    return data 
}

const fetchAllProductPackaging = async ( ) =>{
    let data = await new ProductModel().fetchAllProductPackaging()
    if (data.length == 0) {
            throw new Error("packaging not found!")
        }
    return data 
}

export default {
    createProduct,
    fetchProductById,
    updateProductById,
    fetchAllProducts,
    fetchAllProductCount,
    fetchAllProductCategories,
    fetchAllProductUsageUnits,
    fetchAllProductRawMaterials,
    fetchAllProductPackaging

}