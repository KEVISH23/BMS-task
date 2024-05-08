import { inject } from "inversify";
import { controller,httpDelete,httpGet,httpPost,httpPut, request, response } from "inversify-express-utils";
// import { isLoggedIn } from "../middlweare/user.middleware";
import { Request, Response } from "express";
import { BookService } from "../services";
import { TYPES } from "../types/TYPES";
import { IAuthor, IBooks, ICategory } from "../interface";
import { errorHandler } from "../handlers/errorHandler";
import { author, book,category } from "../models";

@controller('/books')
export class BookController{
    constructor(@inject<BookService>(TYPES.BookService) private readonly BS:BookService){}
    @httpGet('/:id?')
    async getBooks(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            // const {Category,Author,search,page,limit} = req.query;
            const {search,page,limit} = req.query;
            let dynamicQuery:any = {}
            // Category && Category?.toString().trim() !== "" ?dynamicQuery = {...dynamicQuery,categoryName:Category}:null
            // Author && Author?.toString().trim() !== "" ?dynamicQuery = {...dynamicQuery,authorName:Author}:null
            search && search.toString().trim() !==""?dynamicQuery={...dynamicQuery,
                $or:["authorName","categoryName","bookTitle","description","ISBN"].map((ele)=>{
                    return({[ele]:{$regex:search,$options:'i'}})
                })
            }:null
            // console.log(dynamicQuery)
            
            //   console.log(pipeline)
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
            let pipeline:any= [
                {
                    $skip:(pagination_page-1)*pagination_limit
                },
                {
                    $limit:pagination_limit
                },
                {
                  $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "result"
                  }
                },
                {
                  $lookup: {
                    from: "authors",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorResult"
                  }
                },
                {
                  $addFields: {
                    authorName: {$arrayElemAt:["$authorResult.authorName",0]},
                    categoryName: {$arrayElemAt:["$result.categoryName",0]},
                  }
                },
                {
                  $project: {
                    result:0,
                    authorResult:0
                  }
                },
                {
                    $match:dynamicQuery
                }
              ]
        //    console.log(query)
        // res.json(pipeline)
           
            // console.log(pagination_page,pagination_limit,pagination_total,totalPage)
            const data:IBooks[] = await this.BS.getBooksService(pipeline,pagination_limit,pagination_page,pagination_total)
            res.status(200).json({message:'Got data',data})
        }catch(err:any){
            const message:string = errorHandler(err);
            res.status(500).json({message})
        }
    }
    //no use
    @httpGet('/?title&author&category')
    async filterBook(@request() req:Request,@response() res:Response):Promise<void>{
        try{
           
        }catch(err){
            const message:string = errorHandler(err);
            res.status(500).json({message})
        }
    }

    @httpPost('/addBook',TYPES.IsAdminMiddleware)
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

    @httpDelete('/delete/:id',TYPES.IsAdminMiddleware)
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

    @httpPut('/update/:id',TYPES.IsAdminMiddleware)
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