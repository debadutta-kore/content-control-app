import lt from 'localtunnel'
import { Server } from 'socket.io'
import http from 'http'
import logger from 'electron-log/main'

/**
 *
 * @param {number} port
 * @returns {import('http').Server}
 */
export default function initSocketServer(port = 8080) {
  // initialize websocket server
  const server = http.createServer({ keepAlive: true })
  const wss = new Server(server)

  wss.on('connection', (socket) => {
    logger.debug('*** A new client joined ***')
    const onMessage = (data) => {
      // echo the message to all websocket
      socket.broadcast.emit('message', data)
    }
    const onError = (err) => {
      logger.debug('*** socket error ***', err)
    }
    const onClose = () => {
      logger.debug('*** A client leave ***')
    }
    socket.on('message', onMessage)
    socket.on('error', onError)
    socket.on('disconnect', onClose)
  })

  wss.on('connection_error', async (err) => {
    logger.error('error throw by socket server', err)
  })

  wss.on('disconnect', async () => {
    logger.info('web socket server closed')
  })

  server.on('listening', async () => {
    logger.info('socket server is listening to port ', port)
    const tunnel = await lt({
      port,
      subdomain: 'nrfdemo-foodassist'
    })
    logger.info(`localhost:${port} tunnel at ${tunnel.url}`)
    tunnel.on('error', (err) => {
      logger.error('tunnel error', err)
    })
    tunnel.on('close', () => {
      logger.info('tunnel is now closed\n')
    })
    tunnel.on('request', (info) => {
      logger.debug(info)
    })
    // close the tunnel if the socket is closed
    wss.on('disconnect', () => {
      tunnel.close()
    })
    // close the tunnel if the socket is throws any error
    wss.on('connection_error', () => {
      tunnel.close()
    })
  })

  server.listen(port)

  return server
}
