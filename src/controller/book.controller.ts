import { inject } from "inversify";
import { controller,httpDelete,httpGet,httpPost,httpPut, request, response } from "inversify-express-utils";
import { isLoggedIn } from "../middlweare/user.middleware";
import { Request, Response } from "express";
import { BookService } from "../services";
import { TYPES } from "../types/TYPES";
import { IAuthor, IBooks, ICategory } from "../interface";
import { errorHandler } from "../handlers/errorHandler";
import { author, book,category } from "../models";

@controller('/books',isLoggedIn)
export class BookController{
    constructor(@inject<BookService>(TYPES.BookService) private readonly BS:BookService){}
    @httpGet('/:id?')
    async getBooks(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            let query:any={}
            const {Category,Author,search,page,limit} = req.query;
            let pagination_page = Number(page) || 1
            const pagination_total:number = await book.countDocuments()
            const pagination_limit = Number(limit) || pagination_total
            const totalPage = Math.ceil(pagination_total/pagination_limit)
            if(pagination_page>totalPage){
                pagination_page = totalPage
            }
            if(pagination_page<1){
                pagination_page = 1
            }
           if(Category){
            const findCategory:ICategory|null = await category.findOne({categoryName:Category})
            if(findCategory){
                query.category = findCategory._id
            }else{
                res.status(404).json({message:"Category does not exists"})
            }
           }
           if(Author){
            const findAuthor:IAuthor|null = await author.findOne({authorName:Author})
            if(findAuthor){
                query.author = findAuthor._id
            }else{
                res.status(404).json({message:"Author does not exists"})
            }
            // query.author = author
           }
           if(search){
            const regex = new RegExp(search.toString(),'i')
            
            query = {...query,
                        
                        $or:[
                            {bookTitle:regex},
                            {ISBN:regex},
                            {description:regex}
                        ]
                        
                    }
            
           }
        //    console.log(query)
            if(id){
                const idData:IBooks|null = await this.BS.getBookById(id)
                if(idData){
                    res.status(200).json({message:'Got data',data:idData})
                    return;
                }else{
                    res.status(404).json({message:"Data not found"})
                    return;
                }

            }
            // console.log(pagination_page,pagination_limit,pagination_total,totalPage)
            const data:IBooks[] = await this.BS.getBooksService(query,pagination_limit,pagination_page,pagination_total)
            res.status(200).json({message:'Got data',data})
        }catch(err:any){
            const message:string = errorHandler(err);
            res.status(500).json({message})
        }
    }

    @httpGet('/?title&author&category')
    async filterBook(@request() req:Request,@response() res:Response):Promise<void>{
        try{
           
        }catch(err){
            const message:string = errorHandler(err);
            res.status(500).json({message})
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
            const {bookTitle,price,ISBN,author,category,description} = req.body
            if(!bookTitle && !price && !ISBN && !author && !category &&!description){
                res.json({message:'should have bookTitle,price,ISBN,author,category,description to update data'})
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