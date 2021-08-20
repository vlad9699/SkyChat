import axios from 'axios'

const url = 'http://192.168.1.245:8000'

export const loadMessage = async (roomId, skip, limit) => {
  const params = { roomId, skip, limit }
  const response = await axios.get(`${url}/api/messages`, { params })
  return response.data
}

export default loadMessage
