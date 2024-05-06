import { injectable } from "inversify"
import { IBooks } from "../interface";
import { book } from "../models";

@injectable()
export class BookService{
    async getBooksService():Promise<IBooks[]>{
        return await book.find()
    }

    async addBooksService(data:IBooks):Promise<void>{
        await book.create(data)
    }

    async deleteBook(id:string):Promise<void>{
        await book.findByIdAndDelete(id)
    }

    async updateBook(id:string,data:IBooks):Promise<void>{
        await book.findByIdAndUpdate(id,data)
    }
}