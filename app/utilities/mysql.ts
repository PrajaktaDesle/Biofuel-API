import mysql = require('mysql2/promise');
import {Pool, Connection} from "mysql2";
import config = require("../config");
import LOGGER from '../config/LOGGER';

export default class MySQL{
    private static _instance : MySQL;
    poolConnection : Pool;
    connected: boolean = false;
    constructor(){
        // @ts-ignore
        this.poolConnection = mysql.createPool(config.DB);
        this.connect();
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    public static getConnection(callback : Function){
         this.instance.poolConnection.getConnection(function(err, connection){
             if(!err){
                 callback(null, connection);
             }else{
                 callback(err);
             }
         });
    }

    public static async execute_query( query:string, params : any){
        /* this.instance.poolConnection.query(query, (err:Error, results: Object[], fields:[]) => {
            if(err){
                throw err;
            } else{
                //console.log("Mysql Results =>", results);
                return results;
            }
        });*/
        // @ts-ignore
        const [rows,fields] = await this.instance.poolConnection.query(query, params);
        return rows;
    }

    private async connect() {
        this.poolConnection.getConnection((err: any, conn: any) =>{
            if(conn) conn.release();
            if (err) {
                LOGGER.error(`[MYSQL Execption]`, err);
                return false;
            } else {
                this.connected = true;
                LOGGER.info(`[MYSQL connected]`);
                return true;
            }
        });
    }
}