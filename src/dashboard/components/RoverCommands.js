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

const KEY_UP = 38
const KEY_DOWN = 40
const KEY_LEFT = 37
const KEY_RIGHT = 39

class RoverCommands extends Component {
  constructor (props) {
    super(props)

    this.state = ({
      right: false,
      left: false,
      up: false,
      down: false
    })

    this.handleKeyDown = event => {
      switch (event.keyCode) {
        case KEY_UP:
          this.setState({ up: true })
          return
        case KEY_DOWN:
          this.setState({ down: true })
          return
        case KEY_LEFT:
          this.setState({ left: true })
          return
        case KEY_RIGHT:
          this.setState({ right: true })
          return
        default:
          return
      }
    }

    this.handleKeyUp = event => {
      switch (event.keyCode) {
        case KEY_UP:
          this.setState({ up: false })
          return
        case KEY_DOWN:
          this.setState({ down: false })
          return
        case KEY_LEFT:
          this.setState({ left: false })
          return
        case KEY_RIGHT:
          this.setState({ right: false })
          return
        default:
          return
      }
    }

    setInterval(() => {
      const { right, left, up, down } = this.state
      const { dispatch, selectedRover, socket } = this.props

      if (!selectedRover) return

      let A = 0, B = 0

      if (up && right) {
        A = 1
        B = 0
      } else if (up && left) {
        A = 0
        B = 1
      } else if (down && right) {
        A = 0
        B = -1
      } else if (down && left) {
        A = -1
        B = 0
      } else if (up) {
        A = 1
        B = 1
      } else if (down) {
        A = -1
        B = -1
      } else if (right) {
        A = 1
        B = -1
      } else if (left) {
        A = -1
        B = 1
      }

      dispatch(sendCommand(socket, selectedRover, JSON.stringify({ type: 'motors', command: { A: parseFloat(A), B: parseFloat(B) }})))


    }, 100)

    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)

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
    const { up, down, left, right } = this.state
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <KillSwitch dispatch={dispatch} socket={socket} selected={selectedRover} />
        <MotorCommand selected={selectedRover} onSubmit={this.motorCommandsSubmit} />
        <DirectionControl up={up} down={down} left={left} right={right} />
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

let DirectionControl = ({ right, left, up, down }) => (
  <div style={{
    flexDirection: 'column',
    display: 'flex'
  }}>
    <div
      style={{
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-around'
      }}
    >
      <DirectionButton text={'↑'} pressed={up} />
    </div>
    <div
      style={{
        flexDirection: 'row',
        display: 'flex'
      }}
    >
      <DirectionButton text={'←'} pressed={left} />
      <DirectionButton text={'↓'} pressed={down} />
      <DirectionButton text={'→'} pressed={right} />
    </div>
  </div>
)

const DirectionButton = ({ text, style, pressed }) => (
  <div
  style={{
    padding: 15,
    borderRadius: 10,
    fontSize: '1.2em',
    letterSpacing: 2,
    margin: 10,
    backgroundColor: pressed ? COLOR.secondary : COLOR.third,
    color: pressed ? COLOR.third : COLOR.secondary,
    borderColor: COLOR.fourth,
    cursor: 'pointer',
    ...style
  }}
  >
    {text}
  </div>

)

export default connect(state => ({
  selectedRover: state.dashboard.selectedRover
}))(RoverCommands)
