import { injectable } from "inversify"
import { IAuthor } from "../interface";
import { author } from "../models";
interface IAS{
    getAUthor(query:object,page_limit:number,page_page:number):Promise<IAuthor[]>
}
@injectable()
export class authorService implements IAS{
    async getAUthor(pipeline:any,page_limit:number,page_page:number):Promise<IAuthor[]>{
        return await author.aggregate(pipeline)
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