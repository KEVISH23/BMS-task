import mongoose,{Schema,Model} from "mongoose";
import { IAuthor } from "../interface";
const authorSchema = new Schema<IAuthor>({
    authorName:{
        type:String,
        required:[true,"Author must have a name"],
        maxlength:[20,"Upto 20 characters allowed"]
    },
    biography:{
        type:String,
        required:[true,"Author biography required"],
        maxlength:[200,"Upto 200 characters allowed😁"]
    },
    nationality:{
        type:String,
        required:[true,"Author without any nationality is like terrorist.."],
        maxlength:[30,"Upto 30 characters allowed"]
    }
},{timestamps:true})

const author:Model<IAuthor> = mongoose.model<IAuthor>('author',authorSchema)
export default author