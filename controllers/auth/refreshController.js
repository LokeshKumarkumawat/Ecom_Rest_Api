require('dotenv').config()
import Joi from "joi"
import {User, RefreshToken } from '../../models'
import JwtService from '../../services/JwtService'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const refreshController ={
    async refresh(req,res,next){
        const refreshSchema = Joi.object({

            // validtae
            refresh_token:Joi.string().required()
        })


        const { error } = refreshSchema.validate(req.body)

        if(error){
            return next(error);
        }


        let refreshtoken 

        try {

            refreshtoken = await RefreshToken.findOne({token: req.body.refresh_token})
            if(!refreshtoken){
                return next(CustomErrorHandler.unAuthorization('Enter Valid Refresh Token !'))
            }


            


            let user_Id
            try {

                const { _id } = await JwtService.verify(refreshtoken.token, process.env.REFRESH_SECRET)
                user_Id = _id
                
            } catch (error) {
                return next(CustomErrorHandler.unAuthorization('Enter Valid Refresh Token !'))
                
            }

            const user = await User.findOne({_id: user_Id})
            if(!user) {
                return next(CustomErrorHandler.unAuthorization('User not found'))
            }


            //token

            const access_token = JwtService.sign({_id: user.id,role:user.role})
            const refresh_token = JwtService.sign({_id: user.id,role:user.role},'1y', process.env.REFRESH_SECRET)


            //database whitelist

            await RefreshToken.create({token:refresh_token})


            res.json({access_token,refresh_token})

            
        } catch (error) {
            return next(error)
            
        }







        


        

    }
    
}



export default refreshController;