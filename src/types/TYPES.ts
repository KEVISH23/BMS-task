export const TYPES = {
    //controller
    userController:Symbol.for("userController"),
    Category:Symbol.for('Category'),
    AuthorController:Symbol.for('AuthorController'),
    BookController:Symbol.for('BookController'),
    //service
    userService:Symbol.for("userService"),
    AuthMiddleWare: Symbol.for("AuthMiddleWare"),
    CategoryService:Symbol.for('CategoryService'),
    authorService:Symbol.for('authorService'),
    BookService:Symbol.for('BookService'),
    //middleware
    userMiddleware:Symbol.for("userMiddleware"),
}