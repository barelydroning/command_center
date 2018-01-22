import React from 'react'

const Title = ({text, style}) => (
  <div style={{
    color: 'rgb(72, 70, 72)',
    fontSize: '3em',
    paddingTop: 1,
    paddingBottom: 1,
    fontWeight: 'bold',
    letterSpacing: 2,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    ...style
  }}>
    {text}
  </div>
)

export default Title
