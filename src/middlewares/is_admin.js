export default function (req,res,next){
    try {
        console.log(req.session.role);
        if(req.session.role===1){
            next()
        } else {
            return res.status(403).json({
                status: 403,
                method: req.method,
                path: req.url,
                response: 'forbiden'
            })
        }
    } catch (error) {
        next(error)
    }
}

//NOTA: cuando quiero crear con "porduct.mongo.js" un producto en POSTMAN me retorna el error que figura en el codigo.