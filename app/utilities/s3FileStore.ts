import path from "path";
import fs from "fs";
import AWS from 'aws-sdk';
let config = require("../config");


    const bucketName = process.env.AWS_BUCKET_NAME
    const region = process.env.AWS_BUCKET_REGION
    const accessKeyId = process.env.AWS_ACCESS_KEY
    const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
});
export const uploadFile = async(data: any, name : string):Promise<any> => {
//todo buffer stream need to be used
    let fileStream = fs.createReadStream(data.filepath);
    const params: any = {
        Bucket: bucketName,
        Body: fileStream,
        Key: name
    }
    // console.log("Params--->",params);
    return s3.upload(params, (s3Err:any, data:any) =>{
        if (s3Err) throw new  s3Err
        console.log(`File uploaded successfully at ${data.Location}`);
    }).promise()
}

 // downloads file from s3

export function getFileStream(fileKey:any){
    const downloadParams:any = {
        key : fileKey,
        Bucket : bucketName
    }
    s3.getObject(downloadParams).createReadStream()

    }
