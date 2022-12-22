import { NotificationModel } from "../Models/Notification/Notification.model";
const createNotification = async ( data : any ) => {
    let spo, vehicle_count, notification, quantity:any;
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
        notificationData.quantity = quantity
        console.log("notification",notificationData)
        let n = await new NotificationModel().fetchNotificationBy_purchase_order_id(notificationData.purchase_order_id)
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
const fetchAllNotifications = async (pageIndex: number, pageSize : number, sort : any, query : string) => {
        let orderQuery: string;
        try {
            if (sort.key != "") {
                orderQuery = " ORDER BY " + sort.key + " " + sort.order + " ";
            } else {
                orderQuery = "  ";
            }
            let notification = await new NotificationModel().fetchAll(pageSize, (pageIndex - 1) * pageSize, orderQuery, query)
            if (notification.length == 0) throw new Error("No notification found ")
            return notification
        } catch (error: any) {
            console.log(" Exception ===> ", error.message)
            throw error
        }
    }
const fetchNotificationCount =async(query : string) => {
    try {
        let count = await new NotificationModel().fetchNotificationCount(query);
        return count.length;
    }
    catch (error: any) {
        return error
    }
}

const fetchNotificationById = async (data:any ) => {
    try{
        let notification = await new NotificationModel().fetchNotification(data);
        if ( notification.length == 0 ) throw new Error( "No notification found " )
        let notifications = notification[0]
        if(notification[0].status == 0){
            notifications.status = {value : notification[0].status , label : "notification is pending"}
        } else if (notification[0].status == 1){
            notifications.status = {value : notification[0].status , label : "notification is approved"}
        }else{
            notifications.status = {value : notification[0].status , label : "notification is rejected"}
        }
        return notifications
    }
    catch( error:any ){
        console.log( " Exception ===> ", error.message )
        throw error
    }
}
const getNotificationMenue = async (  ) => {
    let data = await new NotificationModel().getNotificationMenue()
    if (data.length == 0) {
        throw new Error("Home Page not found!")
    }
    // LOGGER.info(data)
    return data

}
export default {
    createNotification, 
    updateNotificationDetails, 
    fetchNotificationById,
    fetchAllNotifications,
    fetchNotificationCount,
    getNotificationMenue

}