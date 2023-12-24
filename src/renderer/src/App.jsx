import Carousel from 'react-bootstrap/Carousel'
import { useEffect, useState } from 'react'

import food1 from './assets/food1.jpeg'
import food2 from './assets/food2.jpeg'
import food3 from './assets/food3.jpeg'
import menuImage from './assets/menu.png'
import Slide from './components/slide'
import { Image } from 'react-bootstrap'
import { io } from 'socket.io-client'

const socket = io('wss://nrfdemo-foodassist.loca.lt', {
  transports: ['websocket'],
  upgrade: false,
  reconnection: true
})

function App() {
  const [showMenu, setShowMenu] = useState(false)
  useEffect(() => {
    let timeoutId
    const onMessage = (msg) => {
      console.log(msg)
      if (msg === 'start') {
        clearTimeout(timeoutId)
        setShowMenu(true)
      } else {
        timeoutId = setTimeout(() => {
          setShowMenu(false)
        }, 5 * 1000)
      }
    }

    const onConnect = () => {
      console.log('*** socket connected ***')
    }

    const onClose = () => {
      console.log('*** socket closed ***')
    }

    const onError = () => {
      console.log('*** socket error ***')
    }

    socket.on('disconnect', onClose)
    socket.on('connect', onConnect)
    socket.on('message', onMessage)
    socket.on('connect_error', onError)
    return () => {
      socket.off('disconnect', onClose)
      socket.off('connect', onConnect)
      socket.off('message', onMessage)
      socket.off('connect_error', onError)
    }
  }, [])
  return !showMenu ? (
    <Carousel controls={false} indicators={false} pause="hover">
      <Carousel.Item>
        <Slide src={food1} />
      </Carousel.Item>
      <Carousel.Item>
        <Slide src={food2} />
      </Carousel.Item>
      <Carousel.Item>
        <Slide src={food3} />
      </Carousel.Item>
    </Carousel>
  ) : (
    <div className="d-flex w-100" style={{ height: '100vh' }}>
      <Image src={menuImage} alt="foodassist-menu" className="m-auto mw-100 h-100" />
    </div>
  )
}

export default App
