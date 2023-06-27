import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { validateRequest, BadRequestError } from '@yh-tickets/common'
import { User } from '../models'
import { Password } from '../services'

const router = express.Router()

router.post(
  '/api/users/signin',

  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],

  validateRequest,

  async (req: Request, res: Response) => {
    const {email, password} = req.body
    const existingUser = await User.findOne({email})

    if(!existingUser) {
      throw new BadRequestError('Invalid credentials')
    }

    const passwordsMatch = await Password.compare(existingUser.password, password)

    if(!passwordsMatch) {
      throw new BadRequestError('Invalid credentials')
    }

    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!)

    req.session = {
      jwt: userJwt
    }

    res.status(200).send(existingUser)
  }
)

export { router as signinRouter }
