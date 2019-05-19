import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import {
  sendCommand
} from '../actions'
import {
  Button,
  SmallTitle,
  Input,
  Chart,
  KillSwitch
} from '../../common/components'
import COLOR from '../../common/COLOR'

class RoverCommands extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      dispatch,
      socket,
      selectedRover
    } = this.props
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <KillSwitch dispatch={dispatch} socket={socket} selected={selectedRover} />
      </div>
    )
  }
}

export default connect(state => ({
  selectedRover: state.dashboard.selectedRover
}))(RoverCommands)
