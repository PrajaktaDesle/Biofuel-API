import { NotificationModel } from "../Models/Notification/Notification.model";
const {v4 : uuidv4} = require('uuid');

const createNotification = async ( data : any ) => {
    try{
        let notificationData : any = {};
        if(data.user_id !== undefined && data.order_no !== null && data.user_id !== "") notificationData.user_id=data.user_id;
        if(data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "") notificationData.delivery_date=data.delivery_date;
        if(data.product_name !== undefined && data.product_name !== null && data.product_name !== "") notificationData.product_name=data.product_name;
        if(data.order_no !== undefined && data.order_no !== null && data.order_no !== "") notificationData.spo_no=data.order_no;
        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "") notificationData.quantity=data.quantity;
        if(data.count_of_vehicles !== undefined && data.count_of_vehicles !== null && data.count_of_vehicles !== "") notificationData.count_of_vehicles=data.count_of_vehicles;
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
        if(data.status !== undefined && data.status !== null && data.status !== "") updatedNotification.status=data.status;
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