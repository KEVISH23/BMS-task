import { inject, injectable } from "inversify";

import { controller, Controller,httpDelete,httpGet,httpPost,httpPut, request, response } from "inversify-express-utils";
import { isLoggedIn } from "../middlweare/user.middleware";
import { Request, Response } from "express";
import { CategoryService } from "../services";
import { TYPES } from "../types/TYPES";
import { errorHandler } from "../handlers/errorHandler";

@controller('/category',isLoggedIn)
export class Category{
    constructor(@inject<CategoryService>(TYPES.CategoryService) private CS:CategoryService){}
    @httpGet('/')
    async getCategory(@request() req:Request,@response() res:Response){
        try{
            const data = await this.CS.getCategoryService()
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
}