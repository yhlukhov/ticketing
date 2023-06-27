import { buildClient } from '../api/build-client'

const LandingPage = ({currentUser}) => {
  return <h1>
    {currentUser ? currentUser.email : 'You are not signed in'}
  </h1>
}

// This is run one time on Nextjs SSR server on page load, or on the Client on browsing pages
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const {data} = await client.get('/api/users/currentuser').catch(console.error)
  return data
}

export default LandingPage