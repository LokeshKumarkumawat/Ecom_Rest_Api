require('dotenv').config()
import Joi from 'joi'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import { User , RefreshToken } from '../../models'
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtService'



const registerContainer = {
   async register(req, res, next) {
        console.log(req.body);
        //validate data
        const registerSchema = Joi.object({
            name:Joi.string().min(3).max(30).required(),
            email:Joi.string().email().required(),
            phone:Joi.string().min(10).max(12).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')    
        })

        const { error } = registerSchema.validate(req.body)
        if (error) {
            return next(error)
        }



        //if user already exist

        try {

            const exist = await User.exists({email:req.body.email})
            if(exist){
                return next(CustomErrorHandler.alreadyExists('User Already Exists'))
            }

        } catch (error) {
            return next(error)
        }


        const { name , email , phone , password} = req.body;

        //password hash
        const hashPassword = await bcrypt.hash(password, 10)

        //prepare model

        const user = new User({
            name,
            email,
            phone,
            password:hashPassword
        })


        let access_token;
        let refresh_token;

        try {
            const result = await user.save()
            console.log(result)

            //tokens
            access_token = JwtService.sign({_id:result._id, role:result.role});
            refresh_token = JwtService.sign({_id:result._id, role:result.role},'1y', process.env.REFRESH_SECRET)

            //whitelist database
            await RefreshToken.create({token:refresh_token})
            
        } catch (error) {
            return next(error)
        }

        res.json({access_token,refresh_token})

    }

}
export default registerContainer;