
export const CONNECT_CLIENT = 'CONNECT_CLIENT'

export const connectClient = () => ({type: CONNECT_CLIENT})

export const DISCONNECT_CLIENT = 'DISCONNECT_CLIENT'

export const disconnectClient = () => ({type: DISCONNECT_CLIENT})

export const SET_DRONES = 'SET_DRONES'

export const setDrones = drones => ({type: SET_DRONES, drones})

export const SELECT_DRONE = 'SELECT_DRONE'

export const selectDrone = drone => ({type: SELECT_DRONE, drone})
