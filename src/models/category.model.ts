import mongoose,{Schema,Model, mongo} from "mongoose";
import { ICategory } from "../interface";
const categorySchema = new Schema<ICategory>({
    categoryName:{
        type:String,
        enum:["sci-fi","horror","mystery","thriller","romance","fiction","action","drama"],
        unique:true
    }
},{timestamps:true})

const category:Model<ICategory> = mongoose.model<ICategory>('category',categorySchema)
export default category