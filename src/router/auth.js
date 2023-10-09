import { Router } from "express";
import User from "../dao/models/user.model.js";
import is_form_ok from "../middlewares/is_form_ok.js";
import is_8_char from "../middlewares/is_8_char.js";
import passport from "passport";
import create_hash from "../middlewares/create_hash.js";
import is_valid_pass from "../middlewares/is_valid_pass.js";


const authRouter = Router();

authRouter.post( "/register", is_form_ok, is_8_char, create_hash,
  passport.authenticate("register"),
  async (req, res, next) => {
    try {
      let one = await User.create(req.body)
      console.log(req.user);
      return res.status(201).json({
        success: true,
        message: "user registered",
        user_id: one._id,
      });
    } catch (error) {
      next(error);
    }
  } 
);

authRouter.post(
  "/login",
  is_8_char,
  passport.authenticate("login"),
  //is_valid_pass,
  //create_token,
  async (req, res, next) => {
    try {
      req.session.mail = req.body.mail;
      req.session.role = req.user.role;
      return res
        .status(200)
        .cookie("token", req.session.token, {
          maxAge: 60 * 60 * 24 * 7 * 1000,
          httpOnly: true,
        })
        .json({
          status: 200,
          user: req.user,
          response: req.session.mail + " inicio sesión",
          token: req.session.token,
        });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/signout",
  passport.authenticate('jwt'),
  async (req, res, next) => {
    try {
      console.log(req.session);
      console.log(req.cookies);
      req.session.destroy();
      return res.status(200).clearCookie("token").json({
        status: 200,
        response: "sesion cerrada",
        session: req.session,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter