import { inject } from "inversify";

import { controller, Controller,httpDelete,httpGet,httpPost,httpPut, request, response } from "inversify-express-utils";
import { isLoggedIn } from "../middlweare/user.middleware";
import { Request, Response } from "express";
import { CategoryService } from "../services";
import { TYPES } from "../types/TYPES";
import { errorHandler } from "../handlers/errorHandler";
import { ICategory } from "../interface";
import { category } from "../models";

@controller('/category',isLoggedIn)
export class Category{
    constructor(@inject<CategoryService>(TYPES.CategoryService) private CS:CategoryService){}
    @httpGet('/:id?')
    async getCategory(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {id} = req.params
            const {search,page,limit} = req.query
            let query:any = {}
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
            if(search){
                const regex = new RegExp(search.toString(),'i')
                query = {
                    $or:[
                        {categoryName:regex}
                    ]
                }
            }
            if(id){
                const idData:ICategory|null = await this.CS.getCategoryByIdService(id)
                if(idData){
                    res.status(200).json({message:'Got data',data:idData})
                    return;
                }else{
                    res.status(404).json({message:"Data not found"})
                    return;
                }

            }
            const data = await this.CS.getCategoryService(query,pagination_limit,pagination_page)
            res.status(200).json({data})
        }catch(err:any){
            res.status(500).json({message:err.message})
        }
    }

    @httpPost('/addCategory')
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

    @httpDelete('/delete/:id')
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

    @httpPut('/update/:id')
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