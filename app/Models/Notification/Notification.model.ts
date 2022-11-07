import BaseModel from "../BaseModel";
import {Connection} from "mysql2";

export class NotificationModel extends BaseModel
{
    constructor()
    {
        super();
    }

    async fetchNotification(id:any){
        return await this._executeQuery("select * from dispatch_notification where id = ? ", [id]);
    }
    async fetchNotificationByUserId(id:any){
        return await this._executeQuery("select * from dispatch_notification where user_id = ? ", [id]);
    }

    async createNotification(notificationData:any){
        return await this._executeQuery("insert into dispatch_notification set ?", [notificationData]);
    }
  
    async updateNotificationDetails(data:any){
        return await this._executeQuery("update dispatch_notification set ? where id = ? ", [data, data.id]);
    }


}