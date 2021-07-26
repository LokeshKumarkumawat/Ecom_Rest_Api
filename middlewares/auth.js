import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from '../services/JwtService';
import User from '../models/user';


const auth = async (req,res,next) => {
    let authHeader = req.headers.authorization;
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorization('UnAuthorized User'))
    }

    const token = await authHeader.split(' ')[1];



    try {

        const { _id , role} =  await JwtService.verify(token)

        const user = {
            _id, role
        }

        req.user = user

        next()
        
    } catch (error) {
        return next(error);
    }

    




}


export default auth;