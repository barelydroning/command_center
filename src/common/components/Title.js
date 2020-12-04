import React from 'react'

const Title = ({text, style}) => (
  <div style={{
    color: 'rgb(72, 70, 72)',
    fontSize: '3em',
    paddingTop: 1,
    paddingBottom: 1,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    ...style
  }}>
    {text}
  </div>
)

export default Title
