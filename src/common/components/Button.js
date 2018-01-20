import React from 'react'

const Button = ({text, onClick}) => (
  <button
    onClick={onClick}
    style={{
      padding: 15,
      borderRadius: 10,
      fontSize: '1.2em',
      letterSpacing: 2,
      margin: 10
    }}>
    {text}
  </button>
)

export default Button
