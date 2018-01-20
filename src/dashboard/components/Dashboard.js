import React, { Component } from 'react'
import { Title, Button } from '../../common/components'

import openSocket from 'socket.io-client'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = ({socket: openSocket('http://localhost:3001')})
  }

  render () {
    const { socket } = this.state
    return (
      <div>
        <Title text={'Drone command center'} />
        <Button text={'Connect drone'} onClick={() => socket.emit('connect_drone')} />
      </div>
    )
  }
}

export default Dashboard
