import axios from 'axios'

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const axiosFetcher = (url: string | [string, Record<string, unknown>]) => {
  if (Array.isArray(url)) {
    return API.get(url[0], { params: url[1] }).then(res => res.data)
  }

  return API.get(url).then(res => res.data)
}

export { API, axiosFetcher }
