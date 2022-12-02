import { NotificationModel } from "../Models/Notification/Notification.model";
const {v4 : uuidv4} = require('uuid');

const createNotification = async ( data : any ) => {
    let purchase_order_id,spo, vehicle_count, notification, quantity:any;
    try{
        let notificationData :any = {};
        if(data.purchase_order_no !== undefined && data.purchase_order_no !== null && data.purchase_order_no !== "")
         spo = await new NotificationModel().fetchSPO(data.purchase_order_no)
         notificationData.purchase_order_id = spo[0].id
        if(data.delivery_date !== undefined && data.delivery_date !== null && data.delivery_date !== "") notificationData.delivery_date=data.delivery_date;
        // if(data.product_name !== undefined && data.product_name !== null && data.product_name !== "") notificationData.product_name=data.product_name;
        if(data.quantity !== undefined && data.quantity !== null && data.quantity !== "")
        if(data.count_of_vehicles !== undefined && data.count_of_vehicles !== null && data.count_of_vehicles !== "")
        vehicle_count = data.count_of_vehicles
        quantity = data.quantity/vehicle_count
        console.log('deliverable product  quantity distribution------>',quantity)
        notificationData.quantity =quantity
        console.log("no",notificationData)
        let n = await new NotificationModel().fetchNotificationById(notificationData.purchase_order_id)
        if(n.length !== 0 ) throw new Error("purchase order number already exist")
        for (let i = 0 ; i < vehicle_count ; i++){
            notification = await new NotificationModel().createNotification( notificationData );
            if ( notification.length == 0 ) throw new Error( "notification creation failed" )
        }
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
        let nf = await new NotificationModel().fetchNotification( data.id );
        if ( nf.length == 0 ) throw new Error( "notification not found")
        if(data.status !== undefined && data.status !== null && data.status !== "") updatedNotification.status=data.status;
        let notification = await new NotificationModel().updateNotificationDetails( updatedNotification, data.id );
        if ( notification.length == 0 ) throw new Error( "notification updation failed" )
        return notification
    }
    catch( error:any ){
        console.log( " Exception ===> ", error.message )
        throw error
    }
}

const fetchAllNotifications = async () => {
    try{
        let notification = await new NotificationModel().fetchAll()
        if ( notification.length == 0 ) throw new Error( "No notification found " )
        return notification
    }
    catch( error:any ){
        console.log( " Exception ===> ", error.message )
        throw error
    }
}
const fetchNotificationById = async ( data:any ) => {
    try{
        let notification = await new NotificationModel().fetchNotification( data.id );
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
    fetchNotificationById,
    fetchAllNotifications
}