import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Title, Button } from '../../common/components'
import COLOR from '../../common/COLOR'
import { connectClient, disconnectClient, setDrones, selectDrone, sendCommand, addDroneData, toggleRecording } from '../actions'

import { reduxForm, Field } from 'redux-form'

import { VictoryLine, VictoryChart } from 'victory'

import openSocket from 'socket.io-client'

const Chart = ({title, data, domainY}) => (
  <div style={{
    width: 400
  }}>
    <div style={{
      color: COLOR.secondary
    }}>
      {title}
    </div>
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

    this.pitchSubmit = ({P, I, D}) => {
      const { socket } = this.state
      const { dispatch, selectedDrone } = this.props
      dispatch(sendCommand(socket, selectedDrone, JSON.stringify({P, I, D, type: 'pid', pid_type: 'pitch'})))
    }

    this.rollSubmit = ({P, I, D}) => {
      const { socket } = this.state
      const { dispatch, selectedDrone } = this.props
      dispatch(sendCommand(socket, selectedDrone, JSON.stringify({P, I, D, type: 'pid', pid_type: 'roll'})))
    }

    this.baseSpeedSubmit = ({speed}) => {
      const { socket } = this.state
      const { dispatch, selectedDrone } = this.props
      dispatch(sendCommand(socket, selectedDrone, JSON.stringify({type: 'base_speed', speed})))
    }

    this.filterData = (data, prop) => data.map((dataPoint, i) => ({x: i, y: dataPoint.get(prop)}))

    this.getLastMotorSpeed = (data, motor) => this.getLast(data, `motorSpeed${motor}`)

    this.getLast = (data, param) => {
      const last = data.last()
      return last ? last.get(param) : '-'
    }
  }

  componentDidMount () {
    this.state.socket.emit('connect_client')
  }

  render () {
    const { socket } = this.state
    const { dispatch, availableDrones, isClientConnected, selectedDrone, selectedDroneData, recording } = this.props

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
          {selectedDrone && <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>

            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Chart title={'Pitch'} data={this.filterData(selectedDroneData, 'pitch')} domainY={[-90, 90]} />
              <Chart title='Roll' data={this.filterData(selectedDroneData, 'roll')} domainY={[-90, 90]} />
              <Chart title='Azimuth' data={this.filterData(selectedDroneData, 'azimuth')} domainY={[-180, 180]} />
            </div>
            <div>
              <div style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'row'
              }}>
                <PitchForm onSubmit={this.pitchSubmit} />
                <RollForm onSubmit={this.rollSubmit} />
                <BaseSpeedForm onSubmit={this.baseSpeedSubmit} />
              </div>
              <KillSwitch dispatch={dispatch} socket={socket} selectedDrone={selectedDrone} />
              <TuneButton socket={socket} selectedDrone={selectedDrone} />
              <RecordButton socket={socket} dispatch={dispatch} recording={recording} />
              <div style={{
                padding: 20
              }}>
                <MotorSpeed motor={'A'} speed={this.getLastMotorSpeed(selectedDroneData, 'A')} />
                <MotorSpeed motor={'B'} speed={this.getLastMotorSpeed(selectedDroneData, 'B')} />
                <MotorSpeed motor={'C'} speed={this.getLastMotorSpeed(selectedDroneData, 'C')} />
                <MotorSpeed motor={'D'} speed={this.getLastMotorSpeed(selectedDroneData, 'D')} />
              </div>

              <div style={{
                padding: 20
              }}>
                <PidOutput type={'Pitch'} param={'P'} value={this.getLast(selectedDroneData, 'pitchP')} />
                <PidOutput type={'Pitch'} param={'I'} value={this.getLast(selectedDroneData, 'pitchI')} />
                <PidOutput type={'Pitch'} param={'D'} value={this.getLast(selectedDroneData, 'pitchD')} />
              </div>

              <div style={{
                padding: 20
              }}>
                <PidOutput type='Roll' param='P' value={this.getLast(selectedDroneData, 'rollP')} />
                <PidOutput type='Roll' param='I' value={this.getLast(selectedDroneData, 'rollI')} />
                <PidOutput type='Roll' param='D' value={this.getLast(selectedDroneData, 'rollD')} />
              </div>
              
            </div>
          </div>}
        </div>
      </div>
    )
  }
}

const MotorSpeed = ({motor, speed}) => (
  <div style={{
    marginTop: 5,
    color: COLOR.secondary
  }}>
    {`Motor ${motor}: ${speed}`}
  </div>
)

const PidOutput = ({type, param, value}) => (
  <div style={{
    marginTop: 5,
    color: COLOR.secondary
  }}>
    {`${type} ${param}: ${value}`}
  </div>
)

const MotorsChart = ({title, motorsData, domainY}) => (
  <div style={{
    width: 600
  }}>
    <SmallTitle text={title} />
    <VictoryChart>
      {motorsData.map((data, i) => <VictoryLine
        key={i}
        width={800}
        domain={{y: domainY}}
        style={{
          data: { stroke: COLOR.secondary },
          parent: { border: '1px solid white' }
        }}
       />)}
    </VictoryChart>
  </div>
)

const KillSwitch = ({dispatch, socket, selectedDrone}) => (
  <Button text='Kill drone' onClick={() => dispatch(sendCommand(socket, selectedDrone, JSON.stringify({type: 'kill'})))} />
)

const TuneButton = ({socket, selectedDrone}) => (
  <Button text='Tune drone' onClick={() => socket.emit('tune', selectedDrone)} />
)

const RecordButton = ({dispatch, socket, recording}) => (
  <Button text={recording ? 'Stop recording' : 'Record data'} onClick={() => dispatch(toggleRecording(socket))} />
)

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
      padding: 5
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
          width: 300,
          backgroundColor: COLOR.third,
          color: COLOR.secondary,
          borderColor: COLOR.fourth
        }}
        {...rest}
        {...restInput}
        />
    </div>
  )
}

const SmallTitle = ({text}) => (
  <div style={{
    color: COLOR.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    padding: 10
  }}>
    {text}
  </div>
)

let PitchForm = ({handleSubmit, onSubmit}) => (
  <div>
    <SmallTitle text='Pitch' />
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field name='P' text='P' placeholder='P' component={Input} />
      <Field name='I' text='I' placeholder='I' component={Input} />
      <Field name='D' text='D' placeholder='D' component={Input} />
      <Button text='test' onClick={handleSubmit(onSubmit)} />
    </form>
  </div>
)

PitchForm = reduxForm({
  form: 'command'
})(connect()(PitchForm))

let RollForm = ({handleSubmit, onSubmit}) => (
  <div>
    <SmallTitle text='Roll' />
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field name='P' text='P' placeholder='P' component={Input} />
      <Field name='I' text='I' placeholder='I' component={Input} />
      <Field name='D' text='D' placeholder='D' component={Input} />
      <Button text='test' onClick={handleSubmit(onSubmit)} />
    </form>
  </div>
)

RollForm = reduxForm({
  form: 'roll'
})(connect()(RollForm))

let BaseSpeedForm = ({handleSubmit, onSubmit}) => (
  <form onSubmit={handleSubmit(onSubmit)} style={{
    marginTop: 38
  }}>
    <Field name='speed' text='Base speed' placeholder='Input speed' component={Input} />
  </form>
)

BaseSpeedForm = reduxForm({
  form: 'base_speed'
})(connect()(BaseSpeedForm))

const mapStateToProps = state => ({
  availableDrones: state.dashboard.availableDrones,
  isClientConnected: state.dashboard.isClientConnected,
  selectedDrone: state.dashboard.selectedDrone,
  selectedDroneData: state.dashboard.selectedDroneData,
  recording: state.dashboard.recording
})

export default connect(mapStateToProps)(Dashboard)
