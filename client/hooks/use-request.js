import axios from "axios"
import {useState} from "react"

export const useRequest = ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)

      if(onSuccess) {
        onSuccess(response.data)
      }
      
      return response.data
    } catch (e) {
      setErrors(
        <div className='alert alert-danger'>
          <h3>Ooops...</h3>
          <ul>
            {e.response.data.errors.map(({message, field}) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return {doRequest, errors}
}