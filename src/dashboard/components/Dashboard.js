import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Title, Button } from '../../common/components'

import openSocket from 'socket.io-client'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = ({socket: openSocket('http://localhost:3001')})
  }

  render () {
    const { socket } = this.state
    const { availableDrones } = this.props

    return (
      <div>
        <Title text={'Drone command center'} />
        <Button text={'Connect drone'} onClick={() => socket.emit('connect_drone')} />

        <div>
          {availableDrones.join(', ')}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  availableDrones: state.dashboard.availableDrones
})

export default connect(mapStateToProps)(Dashboard)
