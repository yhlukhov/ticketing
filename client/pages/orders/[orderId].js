import {useEffect, useState} from "react"
import StripeCheckout from 'react-stripe-checkout'
import {useRouter} from 'next/navigation'
import {useRequest} from '../../hooks/use-request'

const OrderDetails = ({order, currentUser, STRIPE_PUBLISHABLE_KEY}) => {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(0)

  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => {
      router.push('/orders')
    }
  })

  const findTimeLeft = () => Math.floor((new Date(order.expiresAt) - new Date()) / 1000)

  useEffect(() => {
    setTimeLeft(findTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(timeLeft => timeLeft - 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      {timeLeft >= 0 && (
        <>
          <h3>Time left to order: {timeLeft} seconds</h3>
          <StripeCheckout
            token={(token) => {
              doRequest({token:token.id})
            }}
            stripeKey={STRIPE_PUBLISHABLE_KEY}
            amount={order.ticket.price}
            email={currentUser.email}
          />
          {errors}
        </>
      )}
      {timeLeft < 0 && <h3>Order expired</h3>}
    </div>
  )
}

OrderDetails.getInitialProps = async (context, client) => {
  const {orderId} = context.query
  const {data} = await client.get(`/api/orders/${orderId}`)
  return {order: data, STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY}
}

export default OrderDetails