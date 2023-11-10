import { Router } from "express";

const cookies_router = Router ()

cookies_router.get('/get', (req, res, next)=>{
    try {
        return res.status(200).cookie(
            'clave',
            'valor',
            { maxAge:60000, signed: true }
        ).json({
            success: true,
            message: 'cookie seteada'
        })
    }catch (error) {
        next(error)
    }
});

cookies_router.get('/read', (req, res, next)=> {
    try {
        //console.log(req.cookies);
        //return res.status(200).json(req.cookies)
        return res.status(200).json(req.signedCookies)
    } catch (error) {
        next(error)
    }
})

cookies_router.get('/clear',(req, res, next)=> {
    try {
        console.log(req.cookies);
        return res.status(200).clearCookie('clave').json({
            success: true,
            message: 'cookie borrada',
            evidence: req.cookies
        })
    } catch (error) {
        next(error)
    }
})


export default cookies_router