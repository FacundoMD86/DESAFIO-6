// Imports
import dotenv from 'dotenv';
import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from "express-session";
import authRouter from './router/auth.js';
import viewRouter from './router/view.router.js';
import ProductRouter from "./router/product.router.js";
import CartRouter from "./router/carts.router.js";
import { connect } from "mongoose";
import errorHandler from './midlewares/errorHandler.js';
import notFoundHandler from './midlewares/notFoundHandler.js';
//import indexRouter from './router/indexRouter.js';
import ProductMongoManager from "./dao/mongomanagers/productManagerMongo.js";
import MessagesManager from "./dao/mongomanagers/messageManagerMongo.js";
import ProductManager from './productos/ProductsManager.js';
import router from "./router/view.router.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

dotenv.config();

const productManager = new ProductManager("./src/files/Productos.json");

const sessionStore = MongoStore.create({
  mongoUrl: process.env.URI, 
  ttl: 60 * 60 * 24 * 7, 
});
//Midlewares
const app = express();
//app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser(process.env.URI));
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET, 
    resave: true,
    saveUninitialized: true,
  })
);
/*app.use(
  expressSession({
    store: MongoStore.create({
      mongoUrl: process.env.URI,
      ttl: 60 * 60 * 24 * 7,
    }),
    secret: process.env.URI,
    resave: true,
    saveUninitialized: true,
  })
);*/

//Puerto de enlace
const PORT = 8080;

//Mongoose
const ready = ()=> {
  console.log('server ready on port' + PORT)
  connect('mongodb+srv://facundomd:11223344@fmd.cqejc72.mongodb.net/ecommerce')
    .then(()=>console.log('database connected'))
    .catch(err=>console.log(err))
};
//const mongoose = require("mongoose");

//Static
app.use(express.static((`${__dirname}/public`)));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.get("/", (req, res)=>{
    res.render("realtimeproducts");
});

app.get("/home", (req, res) => {
  res.render("home");
});

//Routers
app.use(express.static(`${__dirname}/public`));
app.use("/auth", auth_router);
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/api/view", viewRouter);
app.use('/api', indexRouter)
app.use(errorHandler);
app.use(notFoundHandler);
app.use("/",router);

const server = app.listen(PORT, () =>{
    console.log(`Express por Local Host ${server.address().port}`)
        }, ready
);
server.on("error", (error) => console.log(`Error del servidor ${error}`));

//Socket
const socketServer = new Server(server);
const pmanager=new ProductManager( __dirname +"/files/productos.json")

const pmanagersocket=new ProductMongoManager()

//Importar MessagesManager
const messagesManager = new MessagesManager();


socketServer.on("connection",async (socket)=>{
    console.log("cliente conectado con id:" ,socket.id)
    const products = await pmanager.readProduct();
    socket.emit('productos', products);

    socket.on('addProduct', async data => {
        await pmanager.createProduct(data);
        const updatedProducts = await pmanager.getProduct(); 
        socket.emit('productosUpdated', updatedProducts);
      });

      socket.on("deleteProduct", async (id) => {
        console.log("ID del producto a eliminar:", id);
        const deletedProduct = await pmanager.deleteProduct(id);
        const updatedProducts = await pmanager.getProduct();
        socketServer.emit("productosUpdated", updatedProducts);
      });

      socket.on("nuevousuario",(usuario)=>{
        console.log("usuario" ,usuario)
        socket.broadcast.emit("broadcast",usuario)
       })
       socket.on("disconnect",()=>{
           console.log(`Usuario con ID : ${socket.id} esta desconectado `)
       })
       socket.on("chatear",obj=>{
        base.push(obj)
        socketServer.emit("chatupdate",base)
    
      })
       socket.on("mensaje", async (info) => {
        // Guardar el mensaje utilizando el MessagesManager
        console.log(info)
        await messagesManager.createMessage(info);
        // Emitir el mensaje a todos los clientes conectados
        socketServer.emit("chat", await messagesManager.getMessages());
      });
})


export default app

