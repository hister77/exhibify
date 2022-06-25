import React, { Component } from 'react';
import Main from './main/Main'
import './styles/style.css'

export default class App extends Component {
  state = {
    watchCount: 0,
    data: []
  }
  addOne = () => {
    this.setState({ watchCount: this.state.watchCount + 1})
  }
  setData = (data) => {
    this.setState({ data: data })
  }
  render() {
    return (
      <div className='main-wrapper'>
        <h1>Virtual Art Exhibition {this.state.watchCount}</h1>
        <h4>Total art count: {this.state.data.length}</h4>
        <Main data={this.state.data} setData={this.setData} increaser={this.addOne}/>
      </div>
    )
  }
}