import jwt from 'jsonwebtoken'
import { body } from "express-validator"
import express, { Request, Response } from "express"
import { validateRequest, BadRequestError } from "@yh-tickets/common"
import { User } from "../models"

const router = express.Router()

router.post(
  "/api/users/signup",

  [
    body("email")
      .isEmail()
      .withMessage("Invalid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],

  validateRequest,

  async (req: Request, res: Response) => {

    const { email, password } = req.body

    const existingUser = await User.findOne({email})
    if(existingUser) {
      throw new BadRequestError('Email already in use')
    }

    const user = User.build({email, password})
    await user.save()

    // Generate JWT and store it on session object
    
    const userJWT = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!)

    req.session = {
      jwt: userJWT
    }

    res.status(201).send(user)
  }
)

export { router as signupRouter }
