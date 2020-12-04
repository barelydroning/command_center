import React from 'react'

const LIGHT_GREEN = 'rgb(182, 243, 212)'
const DARK_GREEN = '#23BA76'

const LIGHT_YELLOW = 'rgb(239, 240, 120)'
const DARK_YELLOW = 'rgb(255, 238, 83)'

const LIGHT_RED = 'rgb(244, 54, 54)'
const DARK_RED = 'rgb(144, 18, 19)'

const ConnectionLight = ({ isConnected, robot }) => (
    <div style={{
      width: 30,
      height: 30,
      borderRadius: 30,
      borderWidth: 3,
      margin: 20,
      borderStyle: 'solid',
      borderColor: (isConnected && robot) ? LIGHT_GREEN : (isConnected ? LIGHT_YELLOW : LIGHT_RED),
      backgroundColor: (isConnected && robot) ? DARK_GREEN : (isConnected ? DARK_YELLOW : DARK_RED)
    }} />
  )

  export default ConnectionLight