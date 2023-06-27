import {useEffect, useState} from "react"
import {BallTriangle} from 'react-loader-spinner'

const Loader = () => {
  const [elem, setElem] = useState(<></>)

  useEffect(() => {
    setTimeout(() => {
      setElem(
        <div className="d-flex justify-content-center">
          <BallTriangle
            height="60"
            width="60"
            radius="5"
            color='green'
            ariaLabel='three-dots-loading'
            wrapperStyle
            wrapperClass
          />
        </div>
      
      )
    }, 300)
  }, [])

  return elem
}

export default Loader