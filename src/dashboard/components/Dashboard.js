import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Title,
  SmallTitle
} from '../../common/components'
import COLOR from '../../common/COLOR'
import {
  connectClient,
  disconnectClient,
  setRovers,
  setDrones,
  selectDrone,
  addDroneData,
  selectRover
} from '../actions'
import DroneCommands from './DroneCommands'

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

    this.state.socket.on('connected_rovers', rovers => {
      this.props.dispatch(setRovers(rovers))
    })

    this.state.socket.on('drone_data', ({drone, ...rest}) => {
      drone === this.props.selectedDrone && this.props.dispatch(addDroneData(rest))
    })
  }

  componentDidMount () {
    this.state.socket.emit('connect_client')
  }

  render () {
    const { socket } = this.state
    const {
      dispatch,
      availableDrones,
      isClientConnected,
      selectedDrone,
      availableRovers,
      selectedRover
    } = this.props

    return (
      <div style={{
        backgroundColor: COLOR.primary,
        minHeight: window.innerHeight,
        paddingTop: 50
      }}>
        <Title text={'Command center'} style={{
          color: COLOR.secondary,
          textTransform: 'uppercase',
          backgroundColor: COLOR.third
        }} />

        <ConnectionLight isConnected={isClientConnected} drone={selectedDrone} />

        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div>
              <SmallTitle text='Drones' />
              {availableDrones.map(drone => <Robot key={drone} onClick={() => dispatch(selectDrone(drone))} text={drone} selected={selectedDrone === drone} />)}
            </div>
            <div>
              <SmallTitle text='Rovers' />
              {availableRovers.map(rover => <Robot key={rover} onClick={() => dispatch(selectRover(rover))} text={rover} selected={selectedRover === rover} />)}
            </div>
          </div>
          {selectedDrone && <DroneCommands socket={socket} />}
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

const Robot = ({text, onClick, selected}) => (
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
    cursor: 'pointer',
    letterSpacing: 2
  }}
    onClick={onClick}
  >
    {text}
  </div>
)

const mapStateToProps = state => ({
  isClientConnected: state.dashboard.isClientConnected,
  availableDrones: state.dashboard.availableDrones,
  selectedDrone: state.dashboard.selectedDrone,
  availableRovers: state.dashboard.availableRovers,
  selectedRover: state.dashboard.selectedRover
})

export default connect(mapStateToProps)(Dashboard)
