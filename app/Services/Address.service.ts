import UserModel from "../Models/User/User.model"
const getAllCities = async ( query : string ) =>{
    let data = await new UserModel().getAllCities(query)
    if (data.length == 0) {
            throw new Error("Cities not found!")
        }
    return data 
}

const getAllStates = async (query : string ) =>{
    let data = await new UserModel().getAllStates(query)
    if (data.length == 0) {
            throw new Error("States not found!")
        }
    return data 
}

const getCitiesByState = async ( state_id:number, query : string ) =>{
    let data = await new UserModel().getCitiesByState(state_id, query )
    if (data.length == 0) {
            throw new Error("Cities not found!")
        }
    return data 
}

export default {
    getAllCities,
    getAllStates,
    getCitiesByState
}