import CustomErrorHandler from "../services/CustomErrorHandler"
import { User } from '../models'

const admin = async (req, res, next) => {
    try {

        const user = await User.findOne({_id:req.user._id})
        if(user.role === 'admin'){
            next()

        }else{
            return next(CustomErrorHandler.unAuthorization("Admin UnAuthorization"))
        }
        
    } catch (error) {
        return next(CustomErrorHandler.serverProblem('Server Error'))
    }


}


export default admin;