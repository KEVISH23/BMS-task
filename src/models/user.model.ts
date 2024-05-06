import mongoose,{Schema,Model} from "mongoose";
import { IUsers } from "../interface";

const userSchema = new Schema<IUsers>({
    userName:{
        type:String,
        required:[true,"User Name is Required"],
        trim:true,
        minLength:[2,"Name is too short"],
        maxLength:[20,"Name is too long , upto 20 characters allowed"]
    },
    userEmail:{
        type:String,
        required:[true,"Email is Required"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
        trim:true
    },
    role:{
        type:String,
        enum:["Admin","Author"]
    },
    token:{
        type:String,
        default:""
    }
},{timestamps:true})

const user:Model<IUsers> = mongoose.model<IUsers>('user',userSchema)
export default user