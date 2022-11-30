import UserModel from "../Models/User/User.model"
const getAllCities = async ( ) =>{
    let data = await new UserModel().getAllCities()
    if (data.length == 0) {
            throw new Error("Cities not found!")
        }
    return data 
}

const getAllStates = async ( ) =>{
    let data = await new UserModel().getAllStates()
    if (data.length == 0) {
            throw new Error("States not found!")
        }
    return data 
}

const getCitiesByState = async ( state_id:number) =>{
    let data = await new UserModel().getCitiesByState(state_id)
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