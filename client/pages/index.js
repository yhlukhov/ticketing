import Link from 'next/link'

const LandingPage = ({currentUser, tickets}) => {
  const ticketList = tickets.map(ticket => {
    const {id, title, price} = ticket
    return <tr key={id}>
      <td>{title}</td>
      <td>{price}</td>
      <td>
        <Link href={`/tickets/${ticket.id}`} className="btn btn-outline-info btn-sm">
          View
        </Link>
      </td>
    </tr>
  })

  return <>
    <h1>Tickets</h1>
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {ticketList}
      </tbody>
    </table>
  </>
}

// This is run one time on Nextjs SSR server on page load, or on the Client when browsing pages
LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  const promise = new Promise((resolve, reject) => {
    client.get('/api/tickets')
      .then(({data}) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
  return promise
    .then(data => {
      return {tickets:data}
    })
    .catch(err => {
      return {tickets: null}
    })
  // const {data} = await client.get('/api/tickets')
  // return {tickets: data}
}

export default LandingPage