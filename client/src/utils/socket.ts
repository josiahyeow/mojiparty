import socketIOClient from 'socket.io-client'
import config from '../config/config'

const socket = socketIOClient(config.SERVER_URL)

export default socket
