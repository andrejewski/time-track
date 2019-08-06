import React from 'react'
import ReactDOM from 'react-dom'
import { program } from 'raj-react'
import { makeProgram } from './app'
import './index.css'

const App = program(React.Component, makeProgram)

ReactDOM.render(<App />, document.getElementById('root'))
