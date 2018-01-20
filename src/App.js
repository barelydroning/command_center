import React, { Component } from 'react'
import './App.css'
import openSocket from 'socket.io-client'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = ({socket: openSocket('http://localhost:3001')})
  }

  render () {
    const { socket } = this.state
    return (
      <div className='App' style={{
      }}>
        <Title text={'Drone command center'} />
        <Button text={'test'} onClick={() => socket.emit('test')} />
        <button onClick={() => socket.emit('connect_drone')}>connect drone</button>
      </div>
    )
  }
}

const Title = ({text}) => (
  <div style={{
    color: 'rgb(72, 70, 72)',
    fontSize: '3em',
    padding: 20,
    fontWeight: 'bold',
    letterSpacing: 5
  }}>
    {text}
  </div>
)

const Button = ({text, onClick}) => (
  <button
    onClick={onClick}
    style={{
      padding: 10

    }}>
    {text}
  </button>
)

export default App
