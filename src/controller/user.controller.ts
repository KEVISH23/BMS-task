import { interfaces,controller,httpGet,httpDelete,httpPost,httpPut,request,response, next } from "inversify-express-utils";
import { NextFunction, Request,Response } from "express";
import { inject } from "inversify";
import { userService } from "../services/user.service";
import { TYPES } from "../types/TYPES";
import { errorHandler } from "../handlers/errorHandler";
import { IUsers } from "../interface";
import { user } from "../models";

@controller('/user')
export class userController{
    constructor(
        @inject <userService>(TYPES.userService) private US:userService
    ){}
    @httpGet('/', )
    async getUser(@request() req:Request,@response() res:Response){
        try{
            let data = await this.US.getUserService()
            res.json({data})
        }catch(err){
            console.log(err)
        }
    }
    @httpPost('/createUser')
    async createUserController(@request() req:Request,@response() res:Response){
        try{
            if(!req.body.password || !req.body.userEmail || !req.body.userName || !req.body.role){
                res.status(422).json({message:'Email password name and role is required'})
             }else{
                 await this.US.createUserService(req.body)
                 res.status(201).json({message:"User Created"})
             }
        }catch(err){
            let message:string = errorHandler(err);
            res.status(400).json({message})
        }
    }

    @httpPost('/loginUser')
    async loginUserCOntroller(@request() req:Request,@response() res:Response,@next() next:NextFunction){
        // this.am.userLoginMiddleware(req, res, next)
        if(!req.body.userEmail || !req.body.password){
            res.status(400).json({message:'Must have email, password'})
        }else{
                let dbuser:IUsers|null = await user.findOne({userEmail:req.body.userEmail})
                if(!dbuser){
                    res.status(400).json({message:"Please register before login"})
                }else{
                   this.US.loginService(dbuser,req.body.password)
                }
        }
    }
}