import fs from "fs";
import AWS from 'aws-sdk';
import moment from 'moment';
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
export const uploadFile = async (data: any, name: string): Promise<any> => {
//todo buffer stream need to be used
    let fileStream = fs.createReadStream(data.filepath);
    const params: any = {
        Bucket: bucketName,
        Body: fileStream,
        Key: name,
        ContentType :data.mimetype
    }
    return s3.upload(params, (s3Err: any, data: any) => {
        if (s3Err) throw new s3Err
        console.log(`File uploaded successfully at ${data.Location}`);
    }).promise()
}

export const uploadFiles = async ( files: any)=> {
    const images:any = Object.keys(files)
    let s3Path:any = {};
    for (let i = 0; i < images.length; i++) {
        let name : string = "images/"+images[i]+"/"+  moment().unix() + "."+ files[images[i]].originalFilename.split(".").pop()
        const result = await uploadFile(files[images[i]], name);
        if (result == 0 && result == undefined) throw new Error("file upload to s3 failed");
        console.log( "image url : ", result.Location )
        s3Path[images[i]] = result.key;
    }
    return s3Path
}


// downloads file from s3
export function getFileStream(fileKey: any) {
    const downloadParams: any = {
        key: fileKey,
        Bucket: bucketName
    }
    s3.getObject(downloadParams).createReadStream()
}
