import { Router } from "express";
import User from "../dao/models/user.model.js";
import is_form_ok from "../middlewares/is_form_ok.js";
import is_valid_user from "../middlewares/is_valid_user.js";
import is_valid_pass from "../middlewares/is_valid_pass.js";
import is_8_char from "../middlewares/is_8_char.js";
import create_hash from "../middlewares/create_hash.js";
import passport from 'passport';

const auth_router = Router();

auth_router.post('/register', 
  is_form_ok, 
  is_8_char, 
  create_hash,  
  passport.authenticate('register'), 
    async(req, res, next) => {
        try {
          console.log(req.user);
          return res.status(201).json({
            success: true,
            message: 'user registered',
            user_id: req.user.user_id
          })
        } catch (error) {
          next(error)
      }
  })

auth_router.post('/login',
  is_8_char , 
  passport.authenticate('login'),
  is_valid_pass,
  async(req, res, next)=> {
   try {
        req.session.mail = req.body.mail;
        req.session.role = req.user.role;
    return res.status(200).json({
        user: req.user,
        session: req.session,
        message: req.session.mail + ' inicio sesión'
    })
} catch (error) {
    next(error)
}
})

/*auth_router.post('/register', is_form_ok, is_8_char, create_hash, async(req, res, next)=> {
      try {
          let one = await User.create(req.body)
          return res.status(201).json({
            success: true,
            message: 'user registered',
            user_id: one._id
          })
      } catch (error) {
        next(error)
    }
})*/

/*auth_router.post('/login', is_8_char , is_valid_user , is_valid_pass, async(req, res, next)=> {
   try {
        req.session.mail = req.body.mail
        let one = await User.findOne({mail:req.body.mail})  //documento de mongo con todas las propiedades del usuario
        req.session.role = one.role
    return res.status(200).json({
        session: req.session,
        message: req.session.mail + ' inicio sesión'
    })
} catch (error) {
    next(error)
}
})*/

auth_router.post('/signout', async(req, res, next)=> {
  try {
      req.session.destroy()
      return res.status(200).json({
        success: true,
        message: 'sesion cerrada',
        dataSession: req.session
      })
  } catch (error) {
    next(error)
  }
})

export default auth_router