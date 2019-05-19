import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { VictoryLine, VictoryChart } from 'victory'
import {
  sendCommand,
  toggleRecording
} from '../actions'
import {
  Button,
  SmallTitle,
  Input,
  Chart
} from '../../common/components'
import COLOR from '../../common/COLOR'

class DroneCommands extends Component {
  constructor (props) {
    super(props)

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

  render () {
    const {
      dispatch,
      selectedDroneData,
      socket,
      selectedDrone,
      recording
     } = this.props
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>

        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Chart title='Pitch' data={this.filterData(selectedDroneData, 'pitch')} domainY={[-90, 90]} />
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
      </div>
    )
  }
}

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

export default connect(state => ({
  availableDrones: state.dashboard.availableDrones,
  selectedDrone: state.dashboard.selectedDrone,
  selectedDroneData: state.dashboard.selectedDroneData,
  recording: state.dashboard.recording
}))(DroneCommands)
