import React from 'react'
import COLOR from '../COLOR'

const Button = ({text, onClick}) => (
  <button
    onClick={onClick}
    style={{
      padding: 15,
      borderRadius: 10,
      fontSize: '1.2em',
      letterSpacing: 2,
      margin: 10,
      backgroundColor: COLOR.third,
      color: COLOR.secondary,
      cursor: 'pointer'
    }}>
    {text}
  </button>
)

export default Button
