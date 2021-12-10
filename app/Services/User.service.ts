import async from "async";
import {UserModel} from "../Models/User/User.model";

const createUser = async (
    email: string,
    pass: string,
    name: string = '',
) => {
    return null;
};



async function loginUser(email: string, password: string) {
    try{
        let user = await new UserModel().getUser(email);
        if(user.length == 0) throw new Error("No Such User Exists");

        //password bcrypt
        return user
    }catch(e){
        return e;
    }

}


export default {
    createUser,
    loginUser,
};
