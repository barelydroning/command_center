import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Title,
  SmallTitle,
  ConnectionLight
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
import RoverCommands from './RoverCommands'
import roverImage from '../../svg/rover.svg'
import droneImage from '../../svg/drone.svg'

import openSocket from 'socket.io-client'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = ({ socket: openSocket('http://localhost:3001') })

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

    this.state.socket.on('drone_data', ({ drone, ...rest }) => {
      drone === this.props.selectedDrone && this.props.dispatch(addDroneData(rest))
    })
  }

  componentDidMount() {
    this.state.socket.emit('connect_client')
  }

  render() {
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
        height: '100vh',
        width: '100vw',
        fontFamily: '"Noah"'
      }}>
        <div
          style={{
            padding: 20
          }}
        >
          <div
            style={{
              display: 'flex'
            }}
          >
            <ConnectionLight isConnected={isClientConnected} robot={selectedDrone || selectedRover} />

            <Title text={'Command center'} style={{
              color: COLOR.secondary,
              textTransform: 'uppercase',
              backgroundColor: COLOR.third,
              justifyContent: 'center',
              flex: 1
            }} />
          </div>

          

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
                {availableDrones.map((drone, index) => <Robot
                  key={drone}
                  onClick={() => dispatch(selectDrone(selectedDrone !== drone ? drone : null))}
                  text={index + 1}
                  selected={selectedDrone === drone}
                  image={droneImage}
                />)}
              </div>
              <div>
                <SmallTitle text='Rovers' />
                {availableRovers.map((rover, index) => <Robot
                  key={rover}
                  onClick={() => dispatch(selectRover(selectedRover !== rover ? rover : null))}
                  text={index + 1}
                  selected={selectedRover === rover}
                  image={roverImage}
                />)}
              </div>
            </div>
            <div style={{
              padding: 20,
              display: 'flex',
              flex: 1
            }}>
              {selectedDrone && <DroneCommands socket={socket} />}
              {selectedRover && <RoverCommands socket={socket} />}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Robot = ({ text, onClick, selected, image }) => (
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
    fontSize: 40,
    cursor: 'pointer',
    letterSpacing: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }}
    onClick={onClick}
  >
    <img src={image} width={60} />
    <span
      style={{
        marginLeft: 20
      }}
    >#{text}</span>
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
