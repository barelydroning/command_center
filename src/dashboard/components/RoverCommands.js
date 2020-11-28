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

    this.motorCommandsSubmit = ({ A, B }) => {
      const { dispatch, selectedRover, socket } = this.props
      dispatch(sendCommand(socket, selectedRover, JSON.stringify({ type: 'motors', command: { A: parseFloat(A), B: parseFloat(B) }})))
    }
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
        <MotorCommand selected={selectedRover} onSubmit={this.motorCommandsSubmit} />
      </div>
    )
  }
}

let MotorCommand = ({ handleSubmit, onSubmit }) => (
  <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field name='A' text='Motor A' component={Input} />
      <Field name='B' text='Motor B' component={Input} />
      <Button text='Confirm' onClick={handleSubmit(onSubmit)} />
    </form>
  </div>
)

MotorCommand = reduxForm({
  form: 'motor'
})(connect()(MotorCommand))

export default connect(state => ({
  selectedRover: state.dashboard.selectedRover
}))(RoverCommands)
