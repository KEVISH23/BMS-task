import { NextFunction, Request, Response } from "express";
import { next, request, response } from "inversify-express-utils";
import { IUsers,AuthRequest } from "../interface";
import { user } from "../models";
import jwt from 'jsonwebtoken'
     export async function isLoggedIn (req:Request,res:Response,next:NextFunction){
        try{
            const {token} = req.headers
            // console.log(token)
            if(token){
                jwt.verify(token.toString(),"ZindagiEkSafarHaiSuhaNa",(err,decoded:any)=>{
                    // console.log(decoded.role)
                    if(err){
                        res.status(500).json({message:"token provided is not valid.."})
                    }
                    if(decoded){
                        // console.log( decoded)
                        // req.user = decoded
                        if(decoded.data.role === "Admin")
                           {
                            // res.status(200).json({message:"You are admin"})
                               next()
                           }else{
                            res.status(401).json({message:"You are not admin"})
                           } 
                    }
                })
            }else{
                res.status(402).json({message:"Token not provided"})
            }
        }catch(err:any){
            console.log(err)
            res.json({message:"Error in server"})
        }
    }

    