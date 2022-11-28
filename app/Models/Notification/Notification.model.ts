import BaseModel from "../BaseModel";
import {Connection} from "mysql2";

export class NotificationModel extends BaseModel
{
    constructor()
    {
        super();
    }

    async fetchNotification(id:any){
        return await this._executeQuery("select * from purchase_order_dispatch_notifications where id = ? ", [id]);
    }
    async fetchNotificationByUserId(id:any){
        return await this._executeQuery("select * from dispatch_notification where user_id = ? ", [id]);
    }

    async createNotification(notificationData:any){
        return await this._executeQuery("insert into purchase_order_dispatch_notifications set ?", [notificationData]);
    }
  
    async updateNotificationDetails(data:any, id:number){
       return await this._executeQuery("update purchase_order_dispatch_notifications set ? where id = ? ", [data,id]);
    }
    async fetchSPO(spo_no:any) {
        return await this._executeQuery("select * from supplier_purchase_order where po_number = ?", [spo_no])
    }
    async fetchAll() {
        return await this._executeQuery("select * from purchase_order_dispatch_notifications", [])
    }

}