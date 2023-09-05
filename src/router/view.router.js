import { Router } from  "express"
import ProductManager from "../productos/ProductsManager.js"
import __dirname  from "../utils.js"

const pmanager=new ProductManager(__dirname+'/files/products.json')

const router=Router()

router.get("/",async(req,res)=>{
  const listaProductos = await pmanager.getProduct();
  console.log(listaProductos);
  res.render("home",{listaProductos});
})

router.get("/realtimeproducts",async(req,res)=>{
   res.render("realtimeproducts");

router.get("/",(req,res)=>{
   res.render("chat")
})

})

export default router