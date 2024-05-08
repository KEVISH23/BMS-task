import { inject } from "inversify";

import { controller, Controller,httpDelete,httpGet,httpPost,httpPut, request, response } from "inversify-express-utils";
// import { isLoggedIn } from "../middlweare/user.middleware";
import { Request, Response } from "express";
import { CategoryService } from "../services";
import { TYPES } from "../types/TYPES";
import { errorHandler } from "../handlers/errorHandler";
import { ICategory } from "../interface";
import { category } from "../models";

@controller('/category')
export class Category{
    constructor(@inject<CategoryService>(TYPES.CategoryService) private CS:CategoryService){}
    @httpGet('/:id?')
    async getCategory(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            const {search,page,limit} = req.query
            let pagination_page = Number(page) || 1
            const pagination_total:number = await category.countDocuments()
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
                $or:["categoryName"].map((ele)=>{
                    console.log("here");
                    
                    return({[ele]:{$regex:search,$options:'i'}})
                })
            }:null
            const pipeline = [
                {$skip:(pagination_page-1)*pagination_limit},{$limit:pagination_limit},
               { $match:dynamicQuery}
            ]
            // res.json(pipeline)
            const data = await this.CS.getCategoryService(pipeline,pagination_limit,pagination_page)
            res.status(200).json({data})
        }catch(err:any){
            res.status(500).json({message:err.message})
        }
    }

    @httpPost('/addCategory',TYPES.IsAdminMiddleware)
    async addCategory(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            // console.log(req.body)
            if(!req.body.categoryName){
                res.status(400).json({message:"Category must have a name"})
                return;
            }
            const data = await this.CS.addCategory(req.body)
            res.status(201).json({message:"Category Created"})
        }catch(err:any){
            let message:string = errorHandler(err);
            res.status(400).json({message})
        }
    }

    @httpDelete('/delete/:id',TYPES.IsAdminMiddleware)
    async deleteCategory(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            let data:ICategory|null = await category.findById(id)
            if(!data){
                res.status(404).json({message:"Data does not exists"});
                return
            }
            await this.CS.deleteCategory(id)
            res.status(200).json({message:"Deleted"})
        }catch(err){
            let message:string = errorHandler(err);
            res.status(400).json({message})
        }
    }

    @httpPut('/update/:id',TYPES.IsAdminMiddleware)
    async updateCategory(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params

            let data:ICategory|null = await category.findById(id)
            if(!data){
                res.status(404).json({message:"Data does not exists"});
                return
            }
            if(!req.body.categoryName){
                res.status(404).json({message:"category name is required.."});
                return
            }
            await this.CS.updateCategory(id,req.body)
            res.status(200).json({message:"Updated"})
        }catch(err:any){
            const message:string = errorHandler(err);
            res.status(500).json({message})
        }
    }
}