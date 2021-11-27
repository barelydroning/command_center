import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import {
  sendCommand
} from '../actions'
import {
  Button,
  Input,
} from '../../common/components'
import COLOR from '../../common/COLOR'

const KEY_UP = 38
const KEY_DOWN = 40
const KEY_LEFT = 37
const KEY_RIGHT = 39
const KEY_MINUS = 65 // A key
const KEY_PLUS = 83 // S key 

const ROVER_DISTANCE_CUT_OFF_DISTANCE = 20

class RoverCommands extends Component {
  constructor(props) {
    super(props)

    this.state = ({
      right: false,
      left: false,
      up: false,
      down: false,
      minus: false,
      plus: false,
      speed: 0.4
    })

    this.setSpeed = diff => {
      const oldSpeed = this.state.speed
      let newSpeed = Math.max(0, oldSpeed + diff)
      this.setState({ speed: Math.round(Math.min(newSpeed, 1) * 10) / 10 })
    }

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
        case KEY_MINUS:
          this.setState({ minus: true })
          return
        case KEY_PLUS:
          this.setState({ plus: true })
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
        case KEY_MINUS:
          this.setState({ minus: false })
          this.setSpeed(-0.1)
          return
        case KEY_PLUS:
          this.setState({ plus: false })
          this.setSpeed(0.1)
          return
        default:
          return
      }
    }

    this.handleKeyPress = event => {
      switch (event.keyCode) {
        
      }
    }

    setInterval(() => {
      const { right, left, up, down, speed } = this.state
      const { dispatch, selectedRover, socket, roverDistance } = this.props

      if (!selectedRover) return

      let A = 0, B = 0

      if (up && right) {
        A = -speed
        B = 0
      } else if (up && left) {
        A = 0
        B = speed
      } else if (down && right) {
        A = 0
        B = -speed
      } else if (down && left) {
        A = speed
        B = 0
      } else if (up) {
        // Don't drive in to an obstacle
        if (roverDistance.front < ROVER_DISTANCE_CUT_OFF_DISTANCE) {
          A = 0
          B = 0
        } else {
          A = -speed
          B = speed
        }
      } else if (down) {
        A = speed
        B = -speed
      } else if (right) {
        A = -speed
        B = -speed
      } else if (left) {
        A = speed
        B = speed
      }

      dispatch(sendCommand(
        socket,
        selectedRover,
        JSON.stringify({
          type: 'motors',
          command: { A: parseFloat(A), B: parseFloat(B) }
        }))
      )


    }, 100)

    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('keypress', this.handleKeyPress)

    this.motorCommandsSubmit = ({ A, B }) => {
      const { dispatch, selectedRover, socket } = this.props
      dispatch(sendCommand(socket, selectedRover, JSON.stringify({ type: 'motors', command: { A: parseFloat(A), B: parseFloat(B) } })))
    }
  }

  render() {
    const { up, down, left, right, speed, minus, plus } = this.state
    const {
      roverDistance,
  } = this.props

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Rover roverDistance={roverDistance} />
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 'calc(100% - 20px)',
          backgroundColor: COLOR.third,
          padding: 10,
          justifyContent: 'space-evenly',
        }}>
          <DirectionControl up={up} down={down} left={left} right={right} />
          <SpeedControl speed={speed} minus={minus} plus={plus} />
        </div>
      </div>
    )
  }
}



const Rover = ({
  roverDistance,
}) => (
  <div
    style={{
      flexDirection: 'column',
      display: 'flex',
    }}
  >
    <div
      style={{
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <RoverDistance distance={roverDistance.front} />
    </div>
    <div
      style={{
        flexDirection: 'row',
        display: 'flex',
      }}
    >
      <RoverDistance distance={roverDistance.left} />
      <div
        style={{
          width: 100,
          height: 100, // TODO : add some visual interpretation of rover here?
        }}
      />
      <RoverDistance distance={roverDistance.right} />
    </div>
  </div>
)

const RoverDistance = ({ distance }) => (
  <div
    style={{
      color: COLOR.secondary,
      display: 'flex',
      flexDirection: 'row',
    }}
  >
    <div
      style={{
        fontSize: 40,
      }}
    >
      {distance || '-'}
    </div>
    <div
      style={{
        marginLeft: 10,
        fontSize: 40,
      }}
    >
      cm
    </div>
  </div>
)

let MotorCommand = ({ handleSubmit, onSubmit }) => (
  <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field name='A' text='Motor A' component={Input} />
      <Field name='B' text='Motor B' component={Input} />
      <Button text='Confirm' onClick={handleSubmit(onSubmit)} />
    </form>
  </div>
)

let SpeedControl = ({ speed, minus, plus }) => (
  <div
    style={{
      marginRight: 20,
      marginLeft: 20,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      paddingTop: 20,
    }}
  >
    <div
      style={{
        fontSize: 30,
        textAlign: 'center',
        color: COLOR.secondary
      }}
    >
      Speed
    </div>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <DirectionButton text='-' pressed={minus} />
      <div style={{
        fontSize: 40,
        color: COLOR.secondary,
      }}>
        {speed}
      </div>
      <DirectionButton text='+' pressed={plus} />
    </div>
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
      borderColor: COLOR.second,
      borderWidth: 1,
      borderStyle: 'solid',
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
