import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{ type:String, required:true},
    email:{ type:String, required:true ,unique:true},
    phone:{ type:String, required:true},
    password:{ type:String, required:true},
    role:{ type:String, default:'Customer'}

})


export default mongoose.model('User',userSchema,'users')