import bcrypt from 'bcryptjs'

export default function(req,res,next){
    //modificar la contraseña que viene del formulario
    //por la nueva contraseña protegida/hasheada
    let password_from_form = req.body.password 
    let password_hash = bcrypt.hashSync(
        password_from_form,
        bcrypt.genSaltSync(10)
    )
    //reasigno el valor que viene del form por el hash
    req.body.password = password_hash
    return next()
}