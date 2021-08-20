import io from 'socket.io-client'
import constants from './constants'

// eslint-disable-next-line import/no-mutable-exports
let socket
console.log(socket)

export const promisifyEmit = (key, data) => new Promise((resolve) => {
  const createError = (code, message) => ({ code, message })
  const createdResponse = (result, error) => [result, error]

  if (!socket.connected) return resolve(createdResponse(null, createError(constants.ERROR_CODES.ERROR_CONNECTION, 'Socket disconnected')))
  socket.emit(key, data, (result, error) => resolve(createdResponse(result, error)))

  return null
})

export const connectJoin = (params, cb) => {
  socket = io.connect('/', { query: params })
  socket.once('connected', (data, error) => {
    console.log('Error:', error)
    cb(data, error)
  })
}

export const userJoin = (cb) => {
  socket.on('user:join', (data) => {
    cb(data)
  })
}

export const getMessage = (cb) => {
  socket.on('message:get', (data) => {
    cb(data)
  })
}

export default {
  connectJoin,
  userJoin,
  getMessage,
}
