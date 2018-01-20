import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Title, Button } from '../../common/components'
import { connectClient, disconnectClient } from '../actions'

import openSocket from 'socket.io-client'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = ({socket: openSocket('http://localhost:3001')})

    this.state.socket.on('connect', () => {
      this.props.dispatch(connectClient())
    })

    this.state.socket.on('disconnect', () => {
      this.props.dispatch(disconnectClient())
    })
  }

  render () {
    const { socket } = this.state
    const { availableDrones, isClientConnected } = this.props

    return (
      <div>
        <Title text={'Drone command center'} />
        <Button text={'Connect drone'} onClick={() => socket.emit('connect_drone')} />
        {isClientConnected ? 'CONNECTED' : 'DISCONNECTED'}
        <div>
          {availableDrones.join(', ')}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  availableDrones: state.dashboard.availableDrones,
  isClientConnected: state.dashboard.isClientConnected
})

export default connect(mapStateToProps)(Dashboard)
