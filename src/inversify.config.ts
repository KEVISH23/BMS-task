import { Container } from "inversify";
import { TYPES } from "./types/TYPES";
import { userController } from "./controller";
import {  CategoryService, userService } from "./services";
import { Category } from "./controller/";


let container = new Container()
container.bind<userController>(TYPES.userController).to(userController)
container.bind<userService>(TYPES.userService).to(userService)
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService)
container.bind<Category>(TYPES.Category).to(Category)
// container.bind<userMiddleware>(TYPES.userMiddleware).to(userMiddleware)

export default container