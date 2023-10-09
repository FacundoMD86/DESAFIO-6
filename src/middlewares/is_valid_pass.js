import bcrypt from 'bcryptjs'
import User from '../dao/models/user.model'

export default async function (req, res, next) {
    //comparo las contraseñas
    let password_from_form = req.body.password_from_form
    let user = await User.find ({ mail: req.body.mail})
    let password_hash = user.password 
    let verified = bcrypt.compareSync(password_from_form, password_hash )
    //el booleano que resulte de la comparacion
    //se utiliza para condicionar si dejo pasar o no
    if (verified) {
        return next()
    } else {
        return req.status(401).json({
            status: 401,
            method: req.method,
            path: req.url,
            response: 'invalid credentials'
        })
    }
}
