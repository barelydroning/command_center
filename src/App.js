import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux'

import Dashboard from './dashboard'

class App extends Component {
  render () {
    return <Dashboard />
  }
}

export default connect()(App)
