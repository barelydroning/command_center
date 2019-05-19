import React from 'react'
import COLOR from '../COLOR'

const SmallTitle = ({text}) => (
  <div style={{
    color: COLOR.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    padding: 10
  }}>
    {text}
  </div>
)

export default SmallTitle
