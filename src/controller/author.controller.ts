import { inject } from "inversify";
import { controller,httpDelete,httpGet,httpPost,httpPut, request, response } from "inversify-express-utils";
// import { isLoggedIn } from "../middlweare/user.middleware";
import { Request, Response } from "express";
import { IAuthor } from "../interface";
import { authorService } from "../services";
import { TYPES } from "../types/TYPES";
import { errorHandler } from "../handlers/errorHandler";
import { author } from "../models";

@controller('/author')
export class AuthorController{

    constructor(@inject<authorService>(TYPES.authorService) private AS:authorService){}
    @httpGet('/:id?')
    async getAuthors(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            
            const {search,page,limit} = req.query
            let pagination_page = Number(page) || 1
            const pagination_total:number = await author.countDocuments()
            const pagination_limit = Number(limit) || pagination_total
            const totalPage = Math.ceil(pagination_total/pagination_limit)
            if(pagination_page>totalPage){
                pagination_page = totalPage
            }
            if(pagination_page<1){
                pagination_page = 1
            }
            let dynamicQuery:any = {}
            search && search.toString().trim() !==""? dynamicQuery={...dynamicQuery,
                $or:["authorName","nationality","biography"].map((ele)=>{
                    
                    return({[ele]:{$regex:search,$options:'i'}})
                })
            }:null
            const pipeline = [
                {$skip:(pagination_page-1)*pagination_limit},{$limit:pagination_limit},
               { $match:dynamicQuery}
            ]
            const data:IAuthor[] = await this.AS.getAUthor(pipeline,pagination_limit,pagination_page)
            res.status(200).json({data})
        }catch(err:any){
            res.status(500).json({message:err.message})
        }
    }

    @httpPost('/addAuthor',TYPES.IsAdminMiddleware)
    async addAuthors(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            await this.AS.addAuthor(req.body)
            res.status(201).json({message:'author created'})
        }catch(err:any){
            if(err.code === 11000){
                res.status(500).json({message:'Author name already exists'})
            }else{
                const message = errorHandler(err)
                res.status(500).json({message})
            }
        }
    }

    @httpDelete('/delete/:id',TYPES.IsAdminMiddleware)
    async deleteAuthor(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            let data:IAuthor|null = await author.findById(id)
            if(!data){
                res.status(404).json({message:"Data does not exists"});
                return
            }
            await this.AS.deleteAuthor(id)
            res.status(200).json({message:"Deleted"})
        }catch(err){
            let message:string = errorHandler(err);
            res.status(400).json({message})
        }
    }

    @httpPut('/update/:id',TYPES.IsAdminMiddleware)
    async updateAuthor(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            let data:IAuthor|null = await author.findById(id)
            const {authorName,biography,nationality} = req.body
            if(!authorName && !biography && !nationality){
                res.json({message:'should have authorName biography or nationality'})
                return;
            }
            
            if(!data){
                res.status(404).json({message:"Data does not exists"});
                return
            }
            await this.AS.updateAuthor(id,req.body)
            res.status(200).json({message:"Updated"})
        }catch(err:any){
            let message:string = errorHandler(err);
            res.status(400).json({message})
        }
    }
}
