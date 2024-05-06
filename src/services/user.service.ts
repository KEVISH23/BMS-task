import { injectable } from "inversify";
import { IUsers } from "../interface";
import { user } from "../models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
@injectable()
export class userService{
    async getUserService():Promise<IUsers[]>{
        const data:IUsers[] = await user.find()
        return data
    }

    async createUserService(data:IUsers):Promise<void>{
        let plainText:string = data.password
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(plainText,salt)
        data.password = hash
        await user.create(data)
    }

    async loginService(data:IUsers,userPassword:string):Promise<void>{
        console.log('here')
        let compareing =  bcrypt.compareSync(userPassword,data.password)
        console.log(compareing)
        if(compareing){
            let tooken:string = jwt.sign({data},"ZindagiEkSafarHaiSuhaNa")
                await user.findOneAndUpdate({userEmail:data.userEmail},{
                    $set:{token:tooken}
                })
        }else{
            // return false
        }
    }
}