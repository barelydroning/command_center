import { combineReducers } from 'redux'
import droneReducer from './drone/reducer'

const reducers = {
  drone: droneReducer
}

export default combineReducers(reducers)
