import { Request } from "express";
import { IUsers } from "./userInterface";
import { JwtPayload } from "jsonwebtoken";
interface admin extends JwtPayload {
    role?:string
}
export interface AuthRequest extends Request{
    user?:string | admin | undefined |IUsers
}