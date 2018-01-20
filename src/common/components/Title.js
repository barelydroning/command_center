import React from 'react'

const Title = ({text, style}) => (
  <div style={{
    color: 'rgb(72, 70, 72)',
    fontSize: '3em',
    padding: 20,
    fontWeight: 'bold',
    letterSpacing: 5,
    width: '100%',
    textAlign: 'center',
    ...style
  }}>
    {text}
  </div>
)

export default Title
