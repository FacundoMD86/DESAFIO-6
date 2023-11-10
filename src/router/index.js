import { Router } from "express";
import auth_router from "./auth.js";
import product_router from "./product.router.js";
import product_mongo_router from "./product.mongo.js";
import cart_router from "./cart.router.js";
import cookies_router from "./cookies.js";
import session_router from "./session.js";


const indexRouter = Router()

//configurar las rutas de cada recurso
indexRouter.use('/auth', auth_router)
indexRouter.use('/products',product_router)
indexRouter.use('/product_mongo', product_mongo_router)
indexRouter.use('/carts',cart_router)
indexRouter.use('/cookies',cookies_router)
indexRouter.use('/session',session_router)

export default indexRouter