import { Router } from "express";

const session_router = Router()

session_router.get('/get', (req, res, next)=> {
    try {
        return res.status(200).json(req.session)
    } catch (error) {
        next(error)
    }
})

session_router.post('/login', (req, res, next)=>{
    try {
        req.session.data = req.body
        return res.status(200).json({
            session: req.session,
            message: req.session.data.mail + ' inicio sesión'
        })
    } catch (error) {
        next(error)
    }
})


session_router.post('/signout',(req, res, next) => {
    try {
        req.session.destroy()
        return res.status(200).json({
            success : true,
            message : 'sesion cerrada',
            dataSession : req.session,
        })    
    } catch (error) {
        next(error)
    }
})

export default session_router