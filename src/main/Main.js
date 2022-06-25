import React, { Component } from "react";
import axios from 'axios';

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.data = props.data
        this.increaser = props.increaser
        this.setData = props.setData
    }
    state = {}

    componentDidMount() {
        this.pullData()
    }

    shouldComponentUpdate(nexProps, nextState) {
        // Don't update if the next object happens to be the previous one
        return nextState.objectID===this.state.objectID
    }

    randomArt = () => {
        const idx = Math.floor(Math.random() * this.props.data.length)
        this.pullData(idx)
    }

    displayImage = () => {
        return (
            <img src={this.state.primaryImage} alt={this.state.title}/> 
        )
    }

    pullData = (idx) => {
        // Didn't want to abuse the API, so I've decided to host the archive object locally
        // Change it to https://collectionapi.metmuseum.org/public/collection/v1/objects if you don't run your own backend
        const API_URL = idx
            ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${this.props.data.at(idx)}`
            : 'http://localhost:5000/objects'
        axios.get(API_URL)
            .then((response) => {
                if(idx) {
                    this.setState((state, props) => {
                        Object.assign(state, response.data)
                        this.props.increaser()
                        return state
                    })
                }
                else return this.setData(response.data.objectIDs)
            })
            .catch(function (error) {
                console.log('e');
                this.setState({ name: 'Error', date: 'none' })
            })
    }

    render() {
        return (
            <div className="content" onClick={this.randomArt}>
                <h3>{this.state.title}</h3>
                {this.state.primaryImage ? this.displayImage() : <p>{this.state.objectName}</p>}
                <p>{this.state.artistDisplayName}</p>
                <p>{this.state.objectDate}</p>
            </div>
        )
    }
}