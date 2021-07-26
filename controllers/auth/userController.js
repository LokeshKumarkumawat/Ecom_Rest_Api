import { User } from '../../models/'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const userController = {
   async me(req, res, next){

        try {

            const user = await User.findOne({_id:req.user._id}).select('-password -updateAt -__v')
            if(!user){
                return next(CustomErrorHandler.noFound('User Not Found'))
            }

            res.json(user)

            
        } catch (error) {
            return next(error)
        }


    }

}





export default userController;
