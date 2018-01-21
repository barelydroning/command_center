import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Title, Button } from '../../common/components'
import { connectClient, disconnectClient, setDrones, selectDrone } from '../actions'

import { reduxForm, Field } from 'redux-form'

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

    this.state.socket.on('connected_drones', drones => {
      this.props.dispatch(setDrones(drones))
    })
  }

  componentDidMount () {
    this.state.socket.emit('connect_client')
  }

  render () {
    const { socket } = this.state
    const { dispatch, availableDrones, isClientConnected, selectedDrone } = this.props

    return (
      <div>
        <Title text={'Drone command center'} />
        <Button text={'Connect drone'} onClick={() => socket.emit('connect_drone')} />
        {isClientConnected ? 'CONNECTED' : 'DISCONNECTED'}
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          <div>
            {availableDrones.map(drone => <Drone key={drone} onClick={() => dispatch(selectDrone(drone))} text={drone} selected={selectedDrone === drone} />)}
          </div>
          <div style={{
            padding: 10
          }}>
            <TestForm />
          </div>
        </div>
      </div>
    )
  }
}

const Drone = ({text, onClick, selected}) => (
  <div style={{
    backgroundColor: selected ? '#15C56A' : '#efefef',
    color: selected ? 'white' : 'black',
    borderRadius: 10,
    borderColor: '#e8e8e8',
    borderWidth: 3,
    borderStyle: 'solid',
    padding: 30,
    maxWidth: 300,
    margin: 30,
    fontSize: '1.2em',
    letterSpacing: 2
  }}
    onClick={onClick}
  >
    {text}
  </div>
)

const Input = ({input: { ...restInput }, text, style, ...rest}) => {
  return (
    <div>
      <label>{text}</label>
      <input type='text'
        style={{
          padding: 7,
          borderRadius: 5,
          fontSize: '1.2em'
        }}
        {...rest}
        {...restInput}
        />
    </div>
  )
}

let TestForm = ({handleSubmit}) => (
  <form onSubmit={handleSubmit}>
    <Field name='fippel' placeholder='Test' component={Input} />
    <button onClick={handleSubmit}>Fest</button>
  </form>
)

TestForm = reduxForm({
  form: 'test',
  onSubmit: (test, dispatch) => console.log('FEPP', test, dispatch)
})(connect()(TestForm))

const mapStateToProps = state => ({
  availableDrones: state.dashboard.availableDrones,
  isClientConnected: state.dashboard.isClientConnected,
  selectedDrone: state.dashboard.selectedDrone
})

export default connect(mapStateToProps)(Dashboard)
