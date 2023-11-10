import { Router } from "express";
import Producto from "../dao/models/products.model.js";
import ProductManager from "../controllers/ProductsManager.js"

const product_router = Router ()
const product = new ProductManager();

// enrutador.metodoHTTP('endpoint', funcion que ejecuta ese endpoint)
//CRUD de product
//CREATE
product_router.post('/',async(req,res,next)=>{
    try {
        let one = await Producto.create(req.body) //se creo producto
        return res.status(201).json({
            success:true,
            message:`producto id: ${one._id}` //mongo automaticamente asigna aleatoriamente un id aleatorio con la propiedad _id
        })
    } catch (error) {
        next(error)
    }
})     //funcion para crear
//READ
product_router.get('/',async(req,res,next)=>{
    try {
        let all = await Producto.find() //se buscan todos los productos
        return res.status(200).json({
            success: true,
            response: all
        })
    } catch (error) {
        next(error)
    }
})      //funcion para leer
//UPDATE
product_router.put('/:id',async(req,res,next)=>{
    try {
        let { id } = req.params
        let data = req.body
        let one = await Producto.findByIdAndUpdate(id,data) //se modifica un producto
        if (one && data) {
            return res.status(200).json({
                success: true,
                message:`producto id: ${one._id} modified`
            })
        }
        return res.status(404).json({
            success: false,
            message: 'product not found'
        })
    } catch (error) {
        next(error)
    }
})      //funcion para actualizar
//DELETE
product_router.delete('/:id',async(req,res,next)=>{
    try {
        let { id } = req.params
        let one = await Producto.findByIdAndDelete(id) // se elimina por id el producto
        if (one) {
            return res.status(200).json({
                success: true,
                message:'deleted'
            })
        }
        return res.status(404).json({
            success: false,
            message: 'product not found'
        })
    } catch (error) {
        next(error)
    }
})   //funcion para eliminar

export default product_router