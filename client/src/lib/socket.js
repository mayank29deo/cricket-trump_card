import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

let socket = null

function createSocket() {
  const s = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['polling'],   // polling only — works through every mobile carrier/proxy
    timeout: 30000,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 5000,
  })
  return s
}

export const getSocket = () => {
  if (!socket || socket.disconnected) {
    socket = createSocket()
  }
  return socket
}

export const connectSocket = () => {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

// Emits only after socket is confirmed connected
export const safeEmit = (event, data) => {
  const s = getSocket()
  if (s.connected) {
    s.emit(event, data)
  } else {
    s.once('connect', () => s.emit(event, data))
    if (!s.active) s.connect()
  }
}

// Force a fresh socket — call this on reconnect_failed
export const resetSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect()
  }
}
