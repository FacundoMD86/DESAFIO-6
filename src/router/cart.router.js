import { Router } from "express";
import { cartModel } from "../dao/models/carts.model.js";
import CartManager from "../controllers/CartManager.js";

const cart_router = Router ()
const cart = new CartManager();

// enrutador.metodoHTTP('endpoint', funcion que ejecuta ese endpoint)
//CRUD de product
//CREATE
cart_router.post('/',async(req,res,next)=>{
    try {
        let one = await cartModel.create(req.body) //se creo carrito
        return res.status(201).json({
            success:true,
            message:`cart id: ${one._id}` //mongo automaticamente asigna aleatoriamente un id aleatorio con la propiedad _id
        })
    } catch (error) {
        next(error)
    }
})     //funcion para crear
//READ
cart_router.get('/',async(req,res,next)=>{
    try {
        let all = await cartModel.find() //se buscan todos los carrito
        return res.status(200).json({
            success: true,
            response: all
        })
    } catch (error) {
        next(error)
    }
})      //funcion para leer
//UPDATE
cart_router.put('/:id',async(req,res,next)=>{
    try {
        let { id } = req.params
        let data = req.body
        let one = await cartModel.findByIdAndUpdate(id,data) //se modifica un carrito
        if (one && data) {
            return res.status(200).json({
                success: true,
                message:`cart id: ${one._id} modified`
            })
        }
        return res.status(404).json({
            success: false,
            message: 'cart not found'
        })
    } catch (error) {
        next(error)
    }
})      //funcion para actualizar
//DELETE
cart_router.delete('/:id',async(req,res,next)=>{
    try {
        let { id } = req.params
        let one = await cartModel.findByIdAndDelete(id) // se elimina por id el carrito
        if (one) {
            return res.status(200).json({
                success: true,
                message:'deleted'
            })
        }
        return res.status(404).json({
            success: false,
            message: 'cart not found'
        })
    } catch (error) {
        next(error)
    }
})   //funcion para eliminar

export default cart_router