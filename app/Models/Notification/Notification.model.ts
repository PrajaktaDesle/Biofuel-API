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
    async fetchNotificationById(id:any){
        return await this._executeQuery("select * from purchase_order_dispatch_notifications where purchase_order_id = ? ", [id]);
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
    async fetchAll(limit : number, offset : number, sortOrder : string, query : string) {
        return await this._executeQuery(` select pon.id,spo.supplier_id, sp.name as supplier, sp.mobile,spo.po_number, DATE_FORMAT(pon.delivery_date, '%d-%m-%Y')  as delivery_date, pon.status,p.name product, pon.quantity, pon.created_at, pon.updated_at 
                                          from purchase_order_dispatch_notifications pon
                                          left join supplier_purchase_order spo on spo.id = pon.purchase_order_id 
                                          left join customer_sales_orders cso on cso.id = spo.sales_order_id
                                          left join products p on p.id = cso.product_id
                                          left join user sp on sp.id = spo.supplier_id
                                          ${query}
                                          ${sortOrder}
                                          LIMIT ? OFFSET ? `,[limit, offset])
    }
    async fetchNotificationCount(query : string){
        return await this._executeQuery(` select pon.id,spo.supplier_id, sp.name as supplier, sp.mobile,spo.po_number, DATE_FORMAT(pon.delivery_date, '%d-%m-%Y')  as delivery_date, pon.status,p.name product,pon.quantity, pon.created_at, pon.updated_at 
                                          from purchase_order_dispatch_notifications pon
                                          left join supplier_purchase_order spo on spo.id = pon.purchase_order_id 
                                          left join customer_sales_orders cso on cso.id = spo.sales_order_id
                                          left join products p on p.id = cso.product_id
                                          left join user sp on sp.id = spo.supplier_id
                                          ${query}`,[])
    }
}