import PropTypes from 'prop-types'
import style from './slide.module.css'
function Slide(props) {
  const imageId = Math.floor(Math.random() * 100 + 1)
  return (
    <img
      src={props.src}
      alt={'image-' + imageId}
      className={style.slide}
      width={'100%'}
      height={'100%'}
    />
  )
}

Slide.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  src: PropTypes.string.isRequired
}

export default Slide
