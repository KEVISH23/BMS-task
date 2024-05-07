import { injectable } from "inversify";
import { ICategory } from "../interface";
import { category, user } from "../models";
@injectable()
export class CategoryService{
    async getCategoryService(query:object,page_limit:number,page_page:number):Promise<ICategory[]>{
        const data:ICategory[] = await category.find(query).skip((page_page-1)*page_limit).limit(page_limit)
        return data
    }

    async getCategoryByIdService(id:string):Promise<ICategory|null>{
      const data:ICategory|null = await category.findById(id)
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