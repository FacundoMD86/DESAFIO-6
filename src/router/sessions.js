import { Router } from "express";

const session_router = Router()

session_router.get('/get', (req, res, next)=> {
    try {
        return res.status(200).json(req.session)
    } catch (error) {
        next(error)
    }
})

session_router.get('/login', (req, res, next)=>{
    try {
        req.session.mail = 'admin@admin.com'
        req.session.name = 'admin'
        req.session.age = '37'
        return res.status(200).json(req.session)
    } catch (error) {
        next(error)
    }
})

export default session_router