import 'reflect-metadata'
import mongoose from "mongoose"
import express,{Express} from 'express'
import { interfaces,InversifyExpressServer } from "inversify-express-utils"
import container from './inversify.config'
const app:Express = express()
app.use(express.json())
const server = new InversifyExpressServer(container,app)
// server.setConfig((app)=>{
// })
mongoose.connect("mongodb+srv://kevishshaligram:FJlOyORl09Pk1nKo@bms.wxkmfpg.mongodb.net/?retryWrites=true&w=majority&appName=BMS").then(()=>{
    console.log("connected db")
}).catch(err=>{
    console.log(err)
})
let app1 = server.build();
    app1.listen(3000,()=>{
        console.log('listening port')
    });