import React from 'react'

const Notification = ({ message }) => {
  const errorStyle = {
    fontStyle: 'helvetica',
    color: 'white',
    padding: 10,
    border: 1,
    backgroundColor: 'grey',
    borderRadius: 3,
  }

  if (message === null) {
    return null
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

export default Notification