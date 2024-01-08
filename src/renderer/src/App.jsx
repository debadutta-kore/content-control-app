import Carousel from 'react-bootstrap/Carousel'
import { useEffect, useRef, useState } from 'react'
import Fade from 'react-bootstrap/Fade'
import Image from 'react-bootstrap/Image'
import Slide from './components/slide'
import { io } from 'socket.io-client'

import slideDisplayImg from './assets/slide-branding.png'
import slideQrImg from './assets/slide-qr.png'
import slideSalad from './assets/slide-salad.png'
import slideMomo from './assets/slide-momo.png'
import slidePizza from './assets/slide-pizza.jpg'
import slideMultiPizza from './assets/slide-multipizza.jpg'
import slideFoods from './assets/slide-foods.png'
import menuImage from './assets/menu.png'
import thankyouImg from './assets/img-thankyou.png'

const socket = io('wss://nrfdemo-foodassist.loca.lt', {
  transports: ['websocket'],
  upgrade: false,
  reconnection: true
})

function App() {
  const [showMenu, setShowMenu] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    let timeoutId
    const onMessage = (msg) => {
      if (msg === 'ShowMenu') {
        clearTimeout(timeoutId)
        setShowMenu(true)
        if (ref && ref.current) {
          ref.current.src = menuImage
          ref.current.alt = 'foodassist-menu'
        }
      } else if (msg === 'CloseMenu') {
        // check if the image is previously render or not
        if (ref && ref.current) {
          ref.current.src = thankyouImg
          ref.current.alt = 'thankyou'
          timeoutId = setTimeout(() => {
            setShowMenu(false)
          }, 30 * 1000)
        }
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
          <Carousel.Item className="d-flex img-container">
            <Slide src={slideSalad} />
          </Carousel.Item>
          <Carousel.Item className="d-flex img-container">
            <Slide src={slideMomo} />
          </Carousel.Item>
          <Carousel.Item className="d-flex img-container">
            <Slide src={slidePizza} />
          </Carousel.Item>
          <Carousel.Item className="d-flex img-container">
            <Slide src={slideMultiPizza} />
          </Carousel.Item>
          <Carousel.Item className="d-flex img-container">
            <Slide src={slideFoods} />
          </Carousel.Item>
        </Carousel>
      )}
      <Fade timeout={5000} in={showMenu} mountOnEnter unmountOnExit>
        <div className="d-flex img-container">
          <Image src={menuImage} alt="foodassist-menu" className="m-auto w-100 h-100" ref={ref} />
        </div>
      </Fade>
    </>
  )
}

export default App
