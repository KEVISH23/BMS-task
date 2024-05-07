import { injectable } from "inversify"
import { IBooks } from "../interface";
import { book } from "../models";

@injectable()
export class BookService{
    async getBooksService(query:object,page_limit:number,page_page:number,page_total:number):Promise<IBooks[]>{
        // console.log((page_page-1)*page_limit)
        return await book.find(query).skip((page_page-1)*page_limit).limit(page_limit)
    }

    async getBookById(id:string):Promise<IBooks|null>{
        return await book.findById(id)
    }

    async addBooksService(data:IBooks):Promise<void>{
        await book.create(data)
    }
    /**
     * 
     * @param id 
     */
    async deleteBook(id:string):Promise<void>{
        await book.findByIdAndDelete(id)
    }

    async updateBook(id:string,data:IBooks):Promise<void>{
        await book.findByIdAndUpdate(id,data)
    }
}