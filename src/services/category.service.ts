import { injectable } from "inversify";
import { ICategory } from "../interface";
import { category, user } from "../models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
@injectable()
export class CategoryService{
    async getCategoryService():Promise<ICategory[]>{
        const data:ICategory[] = await category.find()
        return data
    }

  async addCategory(data:ICategory):Promise<void>{
    await category.create(data)
  }

  async deleteCategory(id:String):Promise<void>{
    await category.findByIdAndDelete(id)
  }
}