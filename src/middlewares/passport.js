import passport from "passport";
import { Strategy } from "passport-local";
import User from "../dao/models/user.model.js";

export default function() {
    passport.serializeUser((user,done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        return done(null, user)
    })
    passport.use('register',                                         //nombre de la estrategia
        new Strategy(                                                // la estrategia
            { passReqToCallback: true, usernameField: 'mail'},
            async(req, username, password, done)=>{
                try {
                    let one = await User.findOne({ mail: username }) //en la linea 18 se configura como campo principal el mail por eso es lo mismo que la linea 22
                    if (!one) {
                        let user = await User.create(req.body)
                        return done (null, user)
                    } else {
                        return done(null, false)
                    }
                } catch (error) {
                    return done(error, false)
                }
            }
        )
    )
    passport.use('login',
        new Strategy(
            { usernameField: 'mail' },
            async(username, password, done) => {
                try {
                    let one = await User.findOne({ mail: username })
                    if (!one) {
                        return done (null)
                    } else {
                        return done(null, one) // le ponga el nobre que le ponga SIEMPREinyecta al objeto de requerimineto una propiedad 'user'de forma que en req.user tengo los datos del usuario encontrado.
                    }
                } catch (error) {
                    
                }
            }
        )    
    )
}