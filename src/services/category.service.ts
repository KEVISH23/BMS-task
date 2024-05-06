import { injectable } from "inversify";
import { ICategory } from "../interface";
import { category, user } from "../models";
@injectable()
export class CategoryService{
    async getCategoryService():Promise<ICategory[]>{
        const data:ICategory[] = await category.find()
        return data
    }

  async addCategory(data:ICategory):Promise<void>{
    await category.create(data)
  }

  async deleteCategory(id:string):Promise<void>{
    await category.findByIdAndDelete(id)
  }

  async updateCategory(id:string,data:ICategory):Promise<void>{
    await category.findByIdAndUpdate(id,data)
  }
}