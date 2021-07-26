require('dotenv').config()
import Joi from 'joi'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import { User, RefreshToken} from '../../models'
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtService'

const loginController ={
    async login(req,res,next){
        //validate data

        const loginScheme = Joi.object({
            email:Joi.string().required(),
            password:Joi.string().required()
        })

        const { error } = loginScheme.validate(req.body)

        if(error){
            return next(error)
        }

        //user find

        try {

            const user = await User.findOne({ email: req.body.email})
            if(!user){
                return next(CustomErrorHandler.wrongCredentials('Enter A Registered Email Id'))
            }

            //compare password
            const match = await bcrypt.compare(req.body.password,user.password)
            if(!match){
                return next(CustomErrorHandler.wrongCredentials('Enter A Valid Password'))
            }


            //tokens

            const access_token = JwtService.sign({_id: user.id,role:user.role})
            const refresh_token = JwtService.sign({_id: user.id,role:user.role},'1y',process.env.REFRESH_SECRET)

            //database whitelist

            
            await RefreshToken.create({
                token: refresh_token,
            })

            res.json({access_token,refresh_token})


            
        } catch (error) {
            return next(error)
            
        }
    },


    async logout(req, res,next) {
       

        //validate data
        const logoutScheme =  Joi.object({
            refresh_token:Joi.string().required(),
        })

        const { error } = logoutScheme.validate(req.body)

        if(error){
            return next(error)
        }

        try {

           const ok= await RefreshToken.deleteOne({token:req.body.refresh_token})
           if(!ok.deletedCount){
               res.json({status:0})
           }
            
        } catch (err) {
            return next(new Error('Something went wrong in the database'));
        }

        res.json({status:1})

    }
}




export default loginController;