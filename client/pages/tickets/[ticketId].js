import {useRequest} from "../../hooks/use-request"
import Router from 'next/router'

const TicketDetails = ({ticket}) => {
  const {doRequest, errors} = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId:ticket.id
    },
    onSuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`)
    }
  })

  return(
    <div>
      <h1>{ticket.title}</h1>
      <h3>Price: {ticket.price}</h3>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>Purchase</button>
    </div>
  )
}

TicketDetails.getInitialProps = async (context, client) => {
  const {ticketId} = context.query
  const {data} = await client.get(`/api/tickets/${ticketId}`)
  return {ticket: data}
}

export default TicketDetails