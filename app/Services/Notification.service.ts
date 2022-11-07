import { NotificationModel } from "../Models/Notification/Notification.model";
const {v4 : uuidv4} = require('uuid');
import LOGGER from "../config/LOGGER";
import formidable from "formidable";
let config = require("../config");
import * as path from "path";
import moment from 'moment';
import * as fs from "fs";
import e from "express";
import Encryption from "../utilities/Encryption";
import { notDeepEqual } from "assert";

const createNotification = async ( data : any ) => {
    try{
        let notificationData : any = {};
        if(data.supplier_id !== undefined && data.order_no !== null && data.supplier_id !== "") notificationData.supplier_id=data.supplier_id;
        if(data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "") notificationData.delivery_date=data.delivery_date;
        if(data.product_name !== undefined && data.order_no !== null && data.order_no !== "") notificationData.spo_no=data.order_no;
        if(data.order_no !== undefined && data.order_no !== null && data.order_no !== "") notificationData.spo_no=data.order_no;
        if(data.quantity !== undefined && data.order_no !== null && data.order_no !== "") notificationData.spo_no=data.order_no;
        if(data.order_no !== undefined && data.order_no !== null && data.order_no !== "") notificationData.spo_no=data.order_no;
        if(data.count_of_vehicles !== undefined && data.order_no !== null && data.order_no !== "") notificationData.spo_no=data.order_no;
        let notification = await new NotificationModel().createNotification( data );
        if ( notification.length == 0 ) throw new Error( "notification creation failed" )
        return notification
    }
    catch( error:any ){
        console.log( "Exception ===> ", error.message )
        throw error
    }
}


const updateNotificationDetails = async ( data:any ) => {
    try{
        let updatedNotification : any = {}
        if(data.supplier_id !== undefined && data.order_no !== null && data.supplier_id !== "") updatedNotification.supplier_id=data.supplier_id;
        if(data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "") updatedNotification.delivery_date=data.delivery_date;
        if(data.product_name !== undefined && data.order_no !== null && data.order_no !== "") updatedNotification.spo_no=data.order_no;
        if(data.spo_no !== undefined && data.order_no !== null && data.order_no !== "") updatedNotification.spo_no=data.order_no;
        if(data.quantity !== undefined && data.order_no !== null && data.order_no !== "") updatedNotification.spo_no=data.order_no;
        if(data.order_no !== undefined && data.order_no !== null && data.order_no !== "") updatedNotification.spo_no=data.order_no;
        if(data.count_of_vehicles !== undefined && data.order_no !== null && data.order_no !== "") updatedNotification.spo_no=data.order_no;
        let notification = await new NotificationModel().updateNotificationDetails( updatedNotification );
        if ( notification.length == 0 ) throw new Error( "notification updation failed" )
        return notification
    }
    catch( error:any ){
        console.log( " Exception ===> ", error.message )
        throw error
    }
}


const fetchNotificationById = async ( data:any ) => {
    try{
        let notification = await new NotificationModel().fetchNotification( data );
        if ( notification.length == 0 ) throw new Error( "No notification found " )
        return notification
    }
    catch( error:any ){
        console.log( " Exception ===> ", error.message )
        throw error
    }
}

export default {
    createNotification, 
    updateNotificationDetails, 
    fetchNotificationById
}