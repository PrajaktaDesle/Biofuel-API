import mysql from "../utilities/mysql";
import {Connection} from "mysql2";

class BaseModel  {
    constructor() {

    }

    async _executeQuery(query : string, params : Array<any>) {
        let self = this;
        return await mysql.execute_query(query, params);
    }

    async _executeQueryTransaction(sqlConnection: Connection, query : string, params : Array<any>) {
        let self = this;
        return await mysql.execute_query_transaction(sqlConnection, query, params);
    }

    async _executeTransactionQuery(sqlClient : Connection, query : string, params : Array<any>) {
        let self = this;
        return await mysql.execute_query(query, params);
    }

    async _getConnection(){
        return await mysql.getConnection();
    }
}

export default BaseModel;