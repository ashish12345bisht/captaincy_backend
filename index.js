import express from "express";
import http from 'http';
import * as dotenv from 'dotenv';
// import { Server } from "socket.io";
import cors from 'cors';
import { authRoute } from './routes/auth.js';
import { homeRoute } from './routes/home.js';

// import { chatRoute } from './routes/chat.js';
import bodyParser from "body-parser";
import { connectDB } from "./models/connection.js";
import multer from "multer";
import path from "path";
// import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// export const upload = multer({ 
//   storage: multer.diskStorage({
//     destination: function (request, file, callback) {
//       callback(null, './assets/');
//     },
//     filename: function(req,file, cb){
//       cb( null,  Date.now() + '-' + file.originalname)
//     }
//   })
//  })

dotenv.config()
const app = express();
var server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//       credentials: true
//     }
//   });

connectDB()

app.use(cors())
app.use(bodyParser.json())
app.use("/",authRoute);
app.use("/home/",homeRoute);
// app.use("/",upload.single('image'),chatRoute);
// app.use(express.static(path.join(__dirname,'/assets')));
// io.on("connection",(data)=>{
//     console.log("socket connected",data.id);
// })
server.listen(process.env.PORT,()=>{
    console.log(`server running at ${process.env.PORT}`)
})