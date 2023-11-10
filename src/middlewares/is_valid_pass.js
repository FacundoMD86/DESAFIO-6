import bcrypt from 'bcryptjs'
import User from '../dao/models/user.model.js'

export default async function (req, res, next){
        //comparo contraseñas
        let password_from_form = req.body.password
        let user = await User.findOne({ mail:req.body.mail })
        let password_hash = user.password
        let verified = bcrypt.compareSync(password_from_form, password_hash)
        //el booleano que resulte de la comparacion se utiliza para condicionar si dejo pasar o no
        if (verified) {
            return next()
        } else {
            return res.status(401).json({
                status: 401,
                method: req.method,
                path: req.url,
                response: 'invalid credentials'
            })
        }
}