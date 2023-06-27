import {Router, Request, Response } from 'express'
import {requireAuth} from '@yh-tickets/common'
import {Order} from '../models'

const router = Router()

router.get('/api/orders', requireAuth, async (req:Request, res:Response) => {

  const orders = await Order.find({userId:req.currentUser!.id}).populate('ticket')

  res.send(orders)
})

export {router as getAllOrdersRouter}