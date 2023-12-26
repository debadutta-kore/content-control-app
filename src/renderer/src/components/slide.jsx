import PropTypes from 'prop-types'
function Slide(props) {
  const imageId = Math.floor(Math.random() * 100 + 1)
  return (
    <img
      src={props.src}
      alt={'image-' + imageId}
      className="m-auto d-block"
      style={{ height: '100vh' }}
    />
  )
}

Slide.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  src: PropTypes.string.isRequired
}

export default Slide
