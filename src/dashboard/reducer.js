import { combineReducers } from 'redux'
// import * as actions from './actions'

const availableDrones = (state = [], {type}) => {
  switch (type) {
    default: return state
  }
}

export default combineReducers({
  availableDrones
})
