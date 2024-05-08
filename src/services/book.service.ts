import { injectable } from "inversify"
import { IBooks } from "../interface";
import { book } from "../models";

@injectable()
export class BookService{
    
    async getBooksService(pipeline:any,page_limit:number,page_page:number,page_total:number):Promise<IBooks[]>{
        // console.log((page_page-1)*page_limit)
        return await book.aggregate(pipeline)
    }
    /**
     * 
     * @param id 
     * @returns Ibooks|null
     */
    async getBookById(id:string):Promise<IBooks|null>{
        return await book.findById(id)
    }
    
    async addBooksService(data:IBooks):Promise<void>{
        await book.create(data)
    }
    /**
     * 
     * @param id 
     * @return nothing
     */
    async deleteBook(id:string):Promise<void>{
        await book.findByIdAndDelete(id)
    }

    async updateBook(id:string,data:IBooks):Promise<void>{
        await book.findByIdAndUpdate(id,data)
    }
}