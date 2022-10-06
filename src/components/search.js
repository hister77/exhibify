import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Search = () => {

    const [IDs, setIDs] = useState([]);

    const searchGallery = () => {
        axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', { params: { q: ref.current.valueOf()} })
            .then((response) => {
                setIDs(response.data.objectIDs.slice(0,10))
            })
            .catch(e => console.error(e))
    }

    const ref = useRef('*')
    
    const changeValue = (e) => {
        e.target.innerText = ref.current.valueOf()
    }
    const ListOfIDs = () => IDs.map((el,idx) => <a key={idx} href={`https://www.metmuseum.org/art/collection/search/${el}`}>{el} </a>)
    
    return (
        <React.Fragment>
            <form class="iform" id="iform">
                <input type="text" name="search" placeholder='Search'/>
                <input type='submit' value='Hit!' onSubmit={searchGallery} ref={ref}/>
            </form>
            <ListOfIDs />
        </React.Fragment>
        )
}

export default Search