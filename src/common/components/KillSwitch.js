import React from 'react'
import {
  sendCommand
} from '../../dashboard/actions'
import Button from './Button'

const KillSwitch = ({dispatch, socket, selected}) => (
  <Button text='Kill' onClick={() => dispatch(sendCommand(socket, selected, JSON.stringify({type: 'kill'})))} />
)

export default KillSwitch
