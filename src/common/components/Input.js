import React from 'react'
import COLOR from '../COLOR'

const Input = ({input: { ...restInput }, text, style, ...rest}) => {
  return (
    <div style={{
      padding: 5
    }}>
      <label style={{
        padding: 3,
        letterSpacing: 2,
        color: 'white'
      }}>{text}</label><br />
      <input type='text'
        style={{
          padding: 7,
          borderRadius: 5,
          fontSize: '1.2em',
          width: 300,
          backgroundColor: COLOR.third,
          color: COLOR.secondary,
          borderColor: COLOR.fourth
        }}
        {...rest}
        {...restInput}
        />
    </div>
  )
}

export default Input
