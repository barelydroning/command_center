import { combineReducers } from 'redux'
import dashboardReducer from './dashboard/reducer'

const reducers = {
  dashboard: dashboardReducer
}

export default combineReducers(reducers)
