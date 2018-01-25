import { combineReducers } from 'redux'
import { List, fromJS } from 'immutable'
import * as actions from './actions'

const availableDrones = (state = [], {type, drones}) => {
  switch (type) {
    case actions.SET_DRONES: return drones
    default: return state
  }
}

const isClientConnected = (state = false, {type}) => {
  switch (type) {
    case actions.CONNECT_CLIENT: return true
    case actions.DISCONNECT_CLIENT: return false
    default: return state
  }
}

const selectedDrone = (state = null, {type, drone}) => {
  switch (type) {
    case actions.SELECT_DRONE: return drone
    default: return state
  }
}

const SELECTED_DRONE_DATA_BUFFER_SIZE = 50

const selectedDroneData = (state = List(), {type, data}) => {
  switch (type) {
    case actions.ADD_DRONE_DATA:
      return state.size === SELECTED_DRONE_DATA_BUFFER_SIZE ? state.push(fromJS(data)).shift() : state.push(fromJS(data))
    default:
      return state
  }
}

export default combineReducers({
  availableDrones,
  isClientConnected,
  selectedDrone,
  selectedDroneData
})
