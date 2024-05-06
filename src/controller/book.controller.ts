import { inject } from "inversify";
import { controller,httpDelete,httpGet,httpPost,httpPut, request, response } from "inversify-express-utils";
import { isLoggedIn } from "../middlweare/user.middleware";
import { Request, Response } from "express";
import { BookService } from "../services";
import { TYPES } from "../types/TYPES";
import { IBooks } from "../interface";
import { errorHandler } from "../handlers/errorHandler";
import { book } from "../models";

@controller('/books',isLoggedIn)
export class BookController{
    constructor(@inject<BookService>(TYPES.BookService) private readonly BS:BookService){}
    @httpGet('/')
    async getBooks(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const data:IBooks[] = await this.BS.getBooksService()
            res.status(200).json({message:'Got data',data})
        }catch(err:any){
            res.status(500).json({message:err.message})
        }
    }

    @httpPost('/addBook')
    async addBooks(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            await this.BS.addBooksService(req.body)
            res.status(201).json({message:'Book added'})
        }catch(err:any){
            // console.log(err)
            if(err.code === 11000){
                res.status(500).json({message:'ISBN number exists'})
            }else{
                const message:string = errorHandler(err);
                res.status(500).json({message})
            }
        }
    }

    @httpDelete('/delete/:id')
    async deleteById(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            let data:IBooks|null = await book.findById(id)
            if(!data){
                res.status(404).json({message:"Data does not exists"});
                return
            }
            await this.BS.deleteBook(id)
            res.status(200).json({message:"Deleted"})
        }catch(err){
            let message:string = errorHandler(err);
            res.status(400).json({message})
        }
    }

    @httpPut('/update/:id')
    async updateBook(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            let data:IBooks|null = await book.findById(id)
            const {bookTitle,price,ISBN,author,category} = req.body
            if(!bookTitle && !price && !ISBN && !author && !category){
                res.json({message:'should have bookTitle,price,ISBN,author,category to uodate data'})
                return;
            }
            
            if(!data){
                res.status(404).json({message:"Data does not exists"});
                return
            }
            await this.BS.updateBook(id,req.body)
            res.status(200).json({message:"Updated"})
        }catch(err:any){
            let message:string = errorHandler(err);
            res.status(400).json({message})
        }
    }
}