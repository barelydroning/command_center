import dashboardReducer from './dashboard/reducer'
import { reducer as formReducer } from 'redux-form'

const reducers = {
  dashboard: dashboardReducer,
  form: formReducer
}

export default reducers
