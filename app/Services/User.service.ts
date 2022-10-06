import {CustomerModel} from "../Models/Customer/Customer.model";
const jwt = require('jsonwebtoken');
import {UserModel} from "../Models/User/User.model";
import Encryption from "../utilities/Encryption";
import LOGGER from "../config/LOGGER";
import Hashing from "../utilities/Hashing";
// import {CustomerBalanceModel} from "../Models/AddBalance/CustomerBalance.model";
import config from "../config";

const createUser = async (data : any) => {
    if(data.password!==data.confirm_password) throw new Error("password did not match");
    let hash = await new Hashing().generateHash(data.password, 10);
    data.password = hash;
    delete data.confirm_password;
    // console.log(data)
    let user = await new UserModel().createUser(data);
    console.log("User ->>>>", user);
    return user;
};

async function loginUser(data:any) {
    try{
        let user = await new UserModel().getUser(data);
        if(user.length == 0) throw new Error("Invalid credentials");
        //password bcrypt
        const match =await new Hashing().verifypassword(data.password, user[0].password);
        if(!match) throw new Error("Invalid password");
        const token = await Encryption.generateJwtToken({id : user[0].user_id, tenant_id:user[0].tenant_id});
        user[0].token = token;
        delete user[0].password;
        delete user[0].tenant_id;
        return user;
    }catch(e){
        return e;
    }
}

const fetchUserById = async (id: number, tenant_id: number) => {
    try {
        let user = await new UserModel().fetchUserById(id, tenant_id);
        if (user.length == 0) throw new Error("No User found");
        // console.log("customer----->",customer);
        return user[0];
    }
    catch (e){
        throw e;
    }
}

const userDetails = async (data : any) =>{
    let userData = await new UserModel().findUsers(data)
    if (userData[0] == null) throw new Error("details did not match");
    delete userData[0].password;
    delete userData[0].tenant_id;
    return userData;
}


const getActiveUsers = async (tenant_id : number) =>{
    let userData = await new UserModel().getActiveUsers(tenant_id)
    if (userData[0] == null) throw new Error("No Customer is active");
    for(let i=0; i<userData.length;i++){
        delete userData[i].password;
        delete userData[i].tenant_id;
    }

    return userData;
}
const updateUserDetails = async (data:any) => {
    try {
        let user = await new UserModel().updateUserDetails(data);
        if (user.length == 0) throw new Error("User did not update");
        return user[0];
    }
    catch (e){
        return e;
    }
}


export default {
    createUser,
    loginUser,
    userDetails,
    fetchUserById,
    getActiveUsers,
    updateUserDetails
};
