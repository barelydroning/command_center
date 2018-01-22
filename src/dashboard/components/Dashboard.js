import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Title, Button } from '../../common/components'
import COLOR from '../../common/COLOR'
import { connectClient, disconnectClient, setDrones, selectDrone, sendCommand, addDroneData } from '../actions'

import { reduxForm, Field } from 'redux-form'

import { VictoryLine, VictoryChart, VictoryTheme } from 'victory'

import openSocket from 'socket.io-client'

const Chart = ({data, domainY}) => (
  <div style={{
    width: 800
  }}>
    <VictoryChart

    >
      <VictoryLine
        width={800}
        domain={{y: domainY}}
        style={{
          data: { stroke: COLOR.secondary },
          parent: { border: '1px solid white' }
        }}
        data={data}
      />
    </VictoryChart>
  </div>
)

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

    this.state.socket.on('drone_data', ({drone, ...rest}) => {
      drone === this.props.selectedDrone && this.props.dispatch(addDroneData(rest))
    })

    this.onSubmit = ({command}) => {
      const { socket } = this.state
      const { dispatch, selectedDrone } = this.props
      dispatch(sendCommand(socket, selectedDrone, command))
    }
  }

  componentDidMount () {
    this.state.socket.emit('connect_client')
  }

  render () {
    const { dispatch, availableDrones, isClientConnected, selectedDrone, selectedDroneData } = this.props

    return (
      <div style={{
        backgroundColor: COLOR.primary,
        minHeight: window.innerHeight,
        paddingTop: 50
      }}>
        <Title text={'Drone command center'} style={{
          color: COLOR.secondary,
          textTransform: 'uppercase',
          backgroundColor: COLOR.third
        }} />

        <ConnectionLight isConnected={isClientConnected} drone={selectedDrone} />

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
            {selectedDrone && <TestForm onSubmit={this.onSubmit} />}
          </div>
          <Chart data={selectedDroneData.map(({pitch}, i) => ({x: i, y: pitch}))} domainY={[-Math.PI, Math.PI]} />
          <Chart data={selectedDroneData.map(({roll}, i) => ({x: i, y: roll}))} domainY={[-Math.PI, Math.PI]} />
          <Chart data={selectedDroneData.map(({azimuth}, i) => ({x: i, y: azimuth}))} domainY={[-Math.PI, Math.PI]} />
        </div>
      </div>
    )
  }
}

const ConnectionLight = ({isConnected, drone}) => (
  <div style={{
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 2,
    margin: 20,
    borderColor: 'white',
    borderStyle: 'solid',
    backgroundColor: (isConnected && drone) ? '#15C56A' : (isConnected ? 'yellow' : 'red')
  }} />
)

const Drone = ({text, onClick, selected}) => (
  <div style={{
    backgroundColor: selected ? COLOR.secondary : COLOR.third,
    color: selected ? COLOR.primary : COLOR.fourth,
    borderRadius: 10,
    borderColor: COLOR.third,
    borderWidth: 1,
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
    <div style={{
      padding: 40
    }}>
      <label style={{
        padding: 3,
        letterSpacing: 2,
        color: 'white'
      }}>{text}</label><br />
      <input type='text'
        style={{
          padding: 7,
          borderRadius: 5,
          fontSize: '1.2em',
          width: 400
        }}
        {...rest}
        {...restInput}
        />
    </div>
  )
}

let TestForm = ({handleSubmit, onSubmit}) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Field name='command' text='Command' placeholder='Input command' component={Input} />
  </form>
)

TestForm = reduxForm({
  form: 'command'
})(connect()(TestForm))

const mapStateToProps = state => ({
  availableDrones: state.dashboard.availableDrones,
  isClientConnected: state.dashboard.isClientConnected,
  selectedDrone: state.dashboard.selectedDrone,
  selectedDroneData: state.dashboard.selectedDroneData
})

export default connect(mapStateToProps)(Dashboard)
