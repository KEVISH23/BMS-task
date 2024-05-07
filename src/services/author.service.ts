import { injectable } from "inversify"
import { IAuthor } from "../interface";
import { author } from "../models";

@injectable()
export class authorService{
    async getAUthor(query:object,page_limit:number,page_page:number):Promise<IAuthor[]>{
        return await author.find(query).skip((page_page-1)*page_limit).limit(page_limit)
    }
    async getAUthorById(id:string):Promise<IAuthor|null>{
        return await author.findById(id)
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