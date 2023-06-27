import Router from 'next/router'
import {useEffect} from 'react'
import {useRequest} from '../../hooks/use-request'
import Loader from '../../hooks/use-loader'

const SignOut = () => {
  const {doRequest, errors} = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })

  useEffect(() => {
    doRequest()
  }, [])

  return <>{errors ? errors : <Loader />}</>
}

export default SignOut