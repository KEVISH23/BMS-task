import mongoose from "mongoose";

export interface IBooks{
    bookTitle:string,
    author:mongoose.Schema.Types.ObjectId,
    category:mongoose.Schema.Types.ObjectId,
    ISBN:string,
    description:string,
    price:number
}