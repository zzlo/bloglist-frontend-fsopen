import React, { useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button id="view" onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div className="togglable" style={showWhenVisible}>
        <button onClick={toggleVisibility}>{props.cancelLabel}</button>
        {props.children}
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable