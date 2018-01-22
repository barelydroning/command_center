
export const CONNECT_CLIENT = 'CONNECT_CLIENT'

export const connectClient = () => ({type: CONNECT_CLIENT})

export const DISCONNECT_CLIENT = 'DISCONNECT_CLIENT'

export const disconnectClient = () => ({type: DISCONNECT_CLIENT})

export const SET_DRONES = 'SET_DRONES'

export const setDrones = drones => ({type: SET_DRONES, drones})

export const SELECT_DRONE = 'SELECT_DRONE'

export const selectDrone = drone => ({type: SELECT_DRONE, drone})

export const SEND_COMMAND_LOADING = 'SEND_COMMAND_LOADING'
export const SEND_COMMAND_SUCCESS = 'SEND_COMMAND_SUCCESS'
export const SEND_COMMAND_ERROR = 'SEND_COMMAND_ERROR'

export const sendCommand = (socket, drone, command) => {
  return dispatch => {
    dispatch({type: SEND_COMMAND_LOADING})

    socket.emit('drone_command', drone, command)
  }
}

export const ADD_DRONE_DATA = 'ADD_DRONE_DATA'

export const addDroneData = data => {
  return dispatch => {
    dispatch({type: ADD_DRONE_DATA, data})
  }
}
