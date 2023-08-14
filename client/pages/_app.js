import 'bootstrap/dist/css/bootstrap.css'
import Header from '../components/header'
import {buildClient} from '../api/build-client'

const AppComponent = ({Component, pageProps, currentUser}) => {
  return <div>
    <Header currentUser={currentUser} />
    <div className="container">
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  </div>
}

// This is run one time on Nextjs SSR server on page load, or on the Client on browsing pages
AppComponent.getInitialProps = async (appContext) => {
  const {ctx, Component: {getInitialProps}} = appContext
  const client = buildClient(ctx)
  const {data} = await client.get('/api/users/currentuser').catch(console.error)
  const {currentUser} = data

  let pageProps = {}
  if (getInitialProps) {
    // Running getInitialProps for individual Component
    pageProps = await getInitialProps(ctx, client, currentUser)
  }

  return {...data, pageProps}
}

export default AppComponent