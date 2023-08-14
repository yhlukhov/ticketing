import axios from "axios"

export const buildClient = ({req}) => {
  if (req) {
    //* Called on Server
    //* Direct request to Nginx controller: "http:SERVICENAME.NAMESPACE.svc.cluster.local"
    //* req.headers includes: {host: 'ticketing.dev', cookie:'session_cookie'}
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    })
    //* Called from Client
  } else {
    return axios.create({
      baseURL: '/'
    })
  }
}