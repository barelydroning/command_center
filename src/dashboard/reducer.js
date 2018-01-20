import { combineReducers } from 'redux'
import * as actions from './actions'

const availableDrones = (state = [], {type}) => {
  switch (type) {
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

export default combineReducers({
  availableDrones,
  isClientConnected
})
