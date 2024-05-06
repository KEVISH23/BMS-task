import { injectable } from "inversify"
import { IAuthor } from "../interface";
import { author } from "../models";

@injectable()
export class authorService{
    async getAUthor():Promise<IAuthor[]>{
        return await author.find()
    }

    async addAuthor(data:IAuthor):Promise<void>{
        await author.create(data)
    }

    async deleteAuthor(id:String):Promise<void>{
        await author.findByIdAndDelete(id)
    }

    async updateAuthor(id:string,data:object):Promise<void>{
        await author.findByIdAndUpdate(id,data)
    }
}