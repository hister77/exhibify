import React, { Component } from 'react';
import Main from './main/Main'
import './styles/style.css'

const ArtCount = ({total}) => <h4>Total Art Count: {total}</h4>

export default class App extends Component {
  state = {
    count: 0,
    totalArt: 0
  }

  addOne = () => {
    this.setState({ count: this.state.count + 1})
  }

  setArtCount = (c) => {
    this.setState( { totalArt: c })
  }

  render() {
    return (
      <div className='main-wrapper'>
        <h1 id="view-count">Virtual Art Exhibition {this.state.count}</h1>
        <ArtCount total={this.state.totalArt}/>
        <Main viewCount={this.state.count} increaseViewCount={this.addOne} setArtCount={this.setArtCount}/>
      </div>
    )
  }
}