require('dotenv').config()
import jwt from 'jsonwebtoken'

class JwtService{

    static sign(plyload, expiry = '60s',secret = process.env.ACCESS_SECRET){
        return jwt.sign(plyload , secret,{expiresIn:expiry})
    }

    static verify(token , secret = process.env.ACCESS_SECRET){
        return jwt.verify(token , secret)
    }



}


export default JwtService;