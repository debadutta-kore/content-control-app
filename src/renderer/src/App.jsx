import Carousel from 'react-bootstrap/Carousel'
import { useEffect, useState } from 'react'

import slideDisplayImg from './assets/slide-branding.png'
import slideQrImg from './assets/slide-qr.png'
import menuImage from './assets/menu.png'
import Slide from './components/slide'
import Fade from 'react-bootstrap/Fade'
import Image from 'react-bootstrap/Image'
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
      if (msg === 'ShowMenu') {
        clearTimeout(timeoutId)
        setShowMenu(true)
      } else if(msg === 'CloseMenu') {
        timeoutId = setTimeout(() => {
          setShowMenu(false)
        }, 30 * 1000)
      }
    }

    const onConnect = () => {
      console.log('*** socket connected ***')
    }

    const onClose = () => {
      console.log('*** socket closed ***')
    }

    const onError = (err) => {
      console.log('*** socket error ***', err)
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
  return (
    <>
      {!showMenu && (
        <Carousel
          controls={false}
          indicators={false}
          pause={false}
          slide={false}
          fade
          interval={30 * 1000}
        >
          <Carousel.Item className="d-flex img-container">
            <Slide src={slideDisplayImg} />
          </Carousel.Item>
          <Carousel.Item className="d-flex img-container">
            <Slide src={slideQrImg} />
          </Carousel.Item>
        </Carousel>
      )}
      <Fade timeout={5000} in={showMenu} mountOnEnter unmountOnExit>
        <div className="d-flex img-container">
          <Image src={menuImage} alt="foodassist-menu" className="m-auto w-100 h-100" />
        </div>
      </Fade>
    </>
  )
}

export default App
