import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Search = () => {

    const [IDs, setIDs] = useState([]);

    const searchGallery = () => {
        axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', { params: { q: ref.current.value} })
            .then((response) => {
                setIDs(response.data.objectIDs.slice(0,10))
            })
            .catch(e => console.error(e))
    }

    const ref = useRef('*')
    
    const changeValue = (e) => {
        e.target.innerText = ref.current.value
    }
    const ListOfIDs = () => IDs.map((el,idx) => <a key={idx} href={`https://www.metmuseum.org/art/collection/search/${el}`}>{el} </a>)

    useEffect (() => {
        console.log('mounted')
    })
    
    return (
        <React.Fragment>
            <input type="text" name="search" placeholder='Search' ref={ref}/>
            <button onClick={searchGallery}>Hit!</button>
            <ListOfIDs />
        </React.Fragment>
        )
}

export default Search