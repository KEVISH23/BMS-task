import { Container } from "inversify";
import { TYPES } from "./types/TYPES";
import { AuthorController, BookController, userController } from "./controller";
import {  CategoryService, userService, authorService, BookService } from "./services";
import { Category } from "./controller/";
import { IsAdminMiddleware } from "./middlweare/user.middleware";

let container = new Container()
//controller
container.bind<userController>(TYPES.userController).to(userController)
container.bind<Category>(TYPES.Category).to(Category)
container.bind<AuthorController>(TYPES.AuthorController).to(AuthorController)
container.bind<BookController>(TYPES.BookController).to(BookController)
//service
container.bind<userService>(TYPES.userService).to(userService)
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService)
container.bind<BookService>(TYPES.BookService).to(BookService)
container.bind<authorService>(TYPES.authorService).to(authorService)
//middleware
container.bind<IsAdminMiddleware>(TYPES.IsAdminMiddleware).to(IsAdminMiddleware)

export default container