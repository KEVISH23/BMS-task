import mongoose,{Schema,Model} from "mongoose";
import { IBooks } from "../interface";

const bookSchema = new Schema<IBooks>({
    bookTitle:{
        type:String,
        required:[true,"Book title is required"],
        maxLength:[100,"Name is too long upto 100 characters allowed"],
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"author",
        required:[true,"Author name is required"]
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:"Category is required"
    },
    ISBN:{
        type:String,
        unique:true,
        required:[true,'Book must have ISBN'],
        maxLength:[13,"Maximum 13 characters allowed in ISBN"]
    },
    description:{
        type:String,
        maxLength:[
            300,"Maximum 300 characters allowed in description"
        ]
    },
    price:{
        type:Number,
        required:[true,"A book cannot be sold without price"],
        min:[1,'Minimum 1 for price']
    }
})

const book:Model<IBooks> = mongoose.model<IBooks>('book',bookSchema)
export default book