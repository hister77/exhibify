import React, { Component } from "react";
import Search from '../components/search'
import History from '../components/history'
import axios from 'axios';

const Like = (props) => {
    const onClick = () => {
        const likedArtObjects = JSON.parse(localStorage.getItem('liked'))
        const likedArt = { id: props.artData.objectID, title: props.artData.title, author: props.artData.artistDisplayName, date: props.artData.objectDate }
        if(likedArtObjects.__proto__ === [].__proto__ ) {
            likedArtObjects.push(likedArt)
            localStorage.setItem('liked', JSON.stringify(likedArtObjects))
        }
        else localStorage.setItem('liked', JSON.stringify([likedArt]))
    }
    return <button onClick={onClick}>Like</button>
  }

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.increaseViewCount = props.increaseViewCount
        this.viewCount = props.count
        this.setArtCount = props.setArtCount
    }
    state = {
       data: [],
       prevObject: 0
    }

    componentDidMount() {
        this.pullObjects()
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Don't update if the next object is the same as the previous one
        return nextState.prevObject!==nextState.objectID
    }

    randomArt = () => Math.floor(Math.random() * this.state.data.length)

    displayImage = () => <img draggable='true' src={this.state.primaryImage} alt={this.state.title}/> 

    pullObjects = (params) => {
        const defaultParams = { params: { medium: 'Paintings', hasImages: true, q: '*' } }
        const queryParams = { ...defaultParams, ...params }
        axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', queryParams)
            .then((response) => {
                this.setState((state,props) => {
                    Object.assign(state, { data: response.data.objectIDs })
                    this.setArtCount(this.state.data.length)
                    if(this.props.viewCount === 0) this.pullObject()
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    pullObject = () => {
        const idx = this.randomArt()
        axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${this.state.data.at(idx)}`)
            .then((response) => {
                if(response.data.primaryImage !== '') {
                    this.setState((state,props) => {
                        const currObject = state.objectID ? state.objectID : 0
                        Object.assign(state, response.data)
                        Object.assign(state, { prevObject: currObject })
                        this.props.increaseViewCount()
                    })
                }
                else this.pullObject()
            })
    }

    render() {
        return (
            <div className="art-wrapper">
                <div className="content">
                    <h3>{this.state.title}</h3>
                    {this.state.primaryImage ? this.displayImage() : <p>{this.state.objectName}</p>}
                    <p>{this.state.artistDisplayName}</p>
                    <p>{this.state.objectDate}</p>
                </div>
                <button onClick={this.pullObject}>Next</button>
                <Like artData={this.state}/>
                <Search />
                <History />
            </div>
        )
    }
}