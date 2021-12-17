import mysql from "../utilities/mysql";

class BaseModel  {
    constructor() {

    }

    async _executeQuery(query : string, params : Array<any>) {
        let self = this;
        return await mysql.execute_query(query, params);
    }
}

export default BaseModel;